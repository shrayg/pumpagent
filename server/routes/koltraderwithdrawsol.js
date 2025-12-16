import express from "express";
import axios from "axios";
import jwt from "jsonwebtoken";
import supabase from "../utils/supabase.js";
import { solConnection, solRPCURL } from "../utils/constants.js";
import {
  SystemProgram,
  PublicKey,
  Keypair,
  sendAndConfirmTransaction,
  Transaction,
} from "@solana/web3.js";
import bs58 from "bs58";
import { tradeWalletsMap } from "../utils/loadtradewallets.js";

const userWithdrawKoltraderFundsRouter = express.Router();

userWithdrawKoltraderFundsRouter.post("/", async (req, res) => {
  const { proof, api_key, targetWallet, fromWallet, toWithdraw } = req.body;

  try {
    const decoded = jwt.decode(proof, { complete: true });
    if (!decoded || !api_key || !targetWallet || !fromWallet || !toWithdraw)
      throw new Error("Invalid withdrawal.");

    const user = decoded.payload.email.split("@")[0];
    const wallet = api_key?.split("-").slice(1, -1).join("");

    const { data, error } = await supabase
      .from("koltrader")
      .select("privKey")
      .eq("username", user);

    if (error) throw new Error("Invalid withdrawal.");

    const storedPriv = data[0].privKey;
    const withdrawerKeypair = Keypair.fromSecretKey(bs58.decode(storedPriv));
    const foundPrivkey = tradeWalletsMap.get(fromWallet);
    if (storedPriv !== foundPrivkey) throw new Error("Invalid withdrawal.");
    if (withdrawerKeypair.publicKey.toBase58() !== fromWallet)
      throw new Error("Invalid withdrawal.");

    // Valid withdrawal, proceed
    const response = await axios.post(
      solRPCURL(),
      {
        jsonrpc: "2.0",
        id: 1,
        method: "getAccountInfo",
        params: [fromWallet, { encoding: "base58" }],
      },
      {
        headers: { "Content-Type": "application/json" },
      }
    );
    const bal = response?.data?.result?.value?.lamports;
    const balance = bal ? bal : 0;
    if (balance === 0) throw new Error("Invalid withdrawal.");

    const senderPublicKey = new PublicKey(fromWallet);
    const recipientPublicKey = new PublicKey(targetWallet);

    const feeTransferInstruction = SystemProgram.transfer({
      fromPubkey: senderPublicKey,
      toPubkey: recipientPublicKey,
      lamports: BigInt(Math.floor(toWithdraw * 1e9)),
    });

    const { blockhash, lastValidBlockHeight } =
      await solConnection().getLatestBlockhash();

    const transaction = new Transaction({
      recentBlockhash: blockhash,
      feePayer: senderPublicKey,
    }).add(feeTransferInstruction);

    // Sign the transaction
    transaction.sign(withdrawerKeypair);

    const signature = await sendAndConfirmTransaction(
      solConnection(),
      transaction,
      [withdrawerKeypair],
      { commitment: "confirmed" }
    );

    const txResult = await solConnection().confirmTransaction({
      blockhash: blockhash,
      lastValidBlockHeight,
      signature,
    });

    if (txResult?.value?.err) {
      console.error("Transaction failed:", txResult.value.err);
      return res.status(400).json({ error: txResult.value.err });
    }

    res.json({ success: true });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ error: error.message });
  }
});

export default userWithdrawKoltraderFundsRouter;
