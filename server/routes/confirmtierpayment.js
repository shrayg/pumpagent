import express from "express";
import jwt from "jsonwebtoken";
import axios from "axios";
import supabase from "../utils/supabase.js";
import { getAccount, getAssociatedTokenAddress } from "@solana/spl-token";
import { PublicKey } from "@solana/web3.js";
import {
  solConnection,
  solRPCURL,
  USDC_MINT,
  WSOL_ADDRESS,
} from "../utils/constants.js";
import { apiKeyMap } from "../utils/loadapikeys.js";

const confirmTierPaymentRouter = express.Router();

confirmTierPaymentRouter.post("/", async (req, res) => {
  const { proof, method, apiKey } = req.body;

  const decoded = jwt.decode(proof, { complete: true });

  if (!decoded) throw new Error("Invalid.");
  if (method !== "USDC" && method !== "SOL") throw new Error("Invalid.");

  const username = decoded.payload.email.split("@")[0];

  try {
    const { data, error } = await supabase
      .from("usertierpayments")
      .select("pubKey, privKey")
      .eq("username", username);

    if (error) throw new Error(error);
    const pubKey = data[0].pubKey;
    const privKey = data[0].privKey;

    const userPubKey = new PublicKey(pubKey);

    // Run methods to check both for USDC and current converted SOL price
    if (method === "USDC") {
      const ata = await getAssociatedTokenAddress(USDC_MINT, userPubKey);
      const accountData = await getAccount(solConnection(), ata, "confirmed");
      const balance = Number(accountData.amount) / 1e6;
      if (!balance || balance < process.env.TIER_PRICE_USD)
        throw new Error("Insufficient funds.");
    }

    if (method === "SOL") {
      // Get tier sol price

      const res = await axios.get("https://lite-api.jup.ag/price/v2", {
        params: {
          ids: "So11111111111111111111111111111111111111112",
          vsToken: "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v",
        },
      });

      const SOL_PRICE = parseFloat(
        res.data.data["So11111111111111111111111111111111111111112"].price
      );

      const solRequired = Number(
        (process.env.TIER_PRICE_USD / SOL_PRICE).toFixed(2)
      );

      // Get wallet balance
      const response = await axios.post(
        solRPCURL(),
        {
          jsonrpc: "2.0",
          id: 1,
          method: "getAccountInfo",
          params: [pubKey, { encoding: "base58" }],
        },
        {
          headers: { "Content-Type": "application/json" },
        }
      );
      const bal = response?.data?.result?.value?.lamports;
      const walletSolBalance = bal ? bal / 1e9 : 0;

      if (walletSolBalance < solRequired - 0.03)
        throw new Error("Insufficient funds.");
    }
    /////////////////////////////////////////////////////////////////////

    //Success => Update User

    // Check if user was referred

    const { data: refData, error: refError } = await supabase
      .from("users")
      .select("referred_by")
      .eq("username", username);
    if (refError) throw new Error(refError);

    const referral_name = refData[0].referred_by || null;
    let ref_percentage = 5;

    // Calculate referral fee percentage to be paid out
    if (referral_name) {
      const { data: refNameData, error: refNameError } = await supabase
        .from("users")
        .select("tier")
        .eq("username", referral_name);
      if (refNameError) throw new Error(refNameError);
      const refTier = refNameData[0]?.tier;
      if (refTier === "Alchemist") ref_percentage = 10;
    }

    // Move keypair to success table
    const { error: moveError } = await supabase
      .from("completedtierpayments")
      .insert({
        username,
        timestamp: Math.floor(Date.now() / 1000),
        method,
        pubKey,
        privKey,
        referral_name,
        ref_percentage,
      });
    if (moveError) throw new Error(moveError);

    // Update users table tier from Apprentice to Alchemist
    const { data: updatedUsers, error: tierUpdateError } = await supabase
      .from("users")
      .update({
        tier: "Alchemist",
      })
      .eq("username", username)
      .select();
    if (tierUpdateError) throw new Error(tierUpdateError);

    // Update tierpayments to paid status
    const { error: tierError } = await supabase
      .from("usertierpayments")
      .update({ status: "Paid" })
      .eq("username", username);

    if (tierError) throw new Error(tierError);

    // Update API server memory
    apiKeyMap.set(apiKey, "Alchemist");

    const alchemistState = updatedUsers[0];
    res.json(alchemistState);
  } catch (err) {
    console.error("Error completing tier payment:", err.message);
    res.status(400).json({ error: err.message });
  }
});

export default confirmTierPaymentRouter;
