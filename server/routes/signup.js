import express from "express";
import supabase from "../utils/supabase.js";
import { Keypair } from "@solana/web3.js";
import { createNewAPIKey } from "../utils/helpers.js";
import bs58 from "bs58";
import { apiKeyMap } from "../utils/loadapikeys.js";

const signUpRouter = express.Router();

signUpRouter.post("/", async (req, res) => {
  const { username, data, referral } = req.body;

  const uid = data.user.id;
  const keypair = Keypair.generate();
  const pubKey = keypair.publicKey.toBase58();
  const privKey = bs58.encode(keypair.secretKey);
  const newAPIKey = createNewAPIKey(pubKey);

  try {
    // Insert into 'users' table
    const { error: userError } = await supabase.from("users").insert({
      username,
      created_at: Math.floor(Date.now() / 1000),
      uid,
      api_key: newAPIKey,
      referred_by: referral ? referral : null,
    });

    if (userError) {
      console.error("User insert error:", userError.message);
      return res.status(500).json({ error: "Failed to create user." });
    }

    if (referral) {
      try {
        const { data: refArray, error: refArrayError } = await supabase
          .from("users")
          .select("referrals")
          .eq("username", referral);

        if (refArrayError) {
          console.warn("Could not fetch referral data:", refArrayError.message);
        } else if (!refArray || refArray.length === 0) {
          console.warn(`No user found with username: ${referral}`);
        } else {
          let referrals = [];
          try {
            referrals = JSON.parse(refArray[0].referrals || "[]");
          } catch (e) {
            console.warn("Could not parse referrals:", e);
          }

          referrals.push(username);

          const { error: refUpdateError } = await supabase
            .from("users")
            .update({ referrals })
            .eq("username", referral);

          if (refUpdateError) {
            console.warn(
              "Could not update referral list:",
              refUpdateError.message
            );
          }
        }
      } catch (err) {
        console.warn("Unexpected error in referral handling:", err);
      }
    }

    // Insert into 'feewallets' table
    const { error: walletError } = await supabase.from("feewallets").insert({
      username,
      pubKey,
      privKey,
    });

    if (walletError) {
      console.error("Fee wallet insert error:", walletError.message);
      return res.status(500).json({ error: "Failed to create fee wallet." });
    }

    const tierPaymentKeypair = Keypair.generate();
    const tierPaymentPubKey = tierPaymentKeypair.publicKey.toBase58();
    const tierPaymentPrivKey = bs58.encode(tierPaymentKeypair.secretKey);

    // Insert into 'usertierpayments' table
    const { error: tierError } = await supabase
      .from("usertierpayments")
      .insert({
        username,
        pubKey: tierPaymentPubKey,
        privKey: tierPaymentPrivKey,
      });

    if (tierError) {
      console.error("User tier wallet insert error:", tierError.message);
      return res.status(500).json({ error: "Failed to create tier wallet." });
    }
    apiKeyMap.set(newAPIKey, "Apprentice");
    res.status(200).json({ success: true });
  } catch (err) {
    console.error("Unexpected error:", err);
    res.status(500).json({ error: "Internal server error." });
  }
});

export default signUpRouter;
