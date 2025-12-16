import express from "express";
import bs58 from "bs58";
import {
  Connection,
  PublicKey,
  Transaction,
  Keypair,
  SystemProgram,
  LAMPORTS_PER_SOL,
  sendAndConfirmTransaction,
} from "@solana/web3.js";
import { heliusConnection } from "../utils/constants.js";
import { requestTracker } from "../utils/requests.js";

const reclaimSolRouter = express.Router();
const connection = heliusConnection();

reclaimSolRouter.post("/", async (req, res) => {
  requestTracker.totalRequests++;
  const { recipient, bundle } = req.body;

  if (!recipient || !bundle || !Array.isArray(bundle)) {
    return res
      .status(400)
      .json({ error: "Missing or invalid 'recipient' or 'bundle'" });
  }

  try {
    const recipientPubKey = new PublicKey(recipient);
    const results = [];

    for (const privKeyBase58 of bundle) {
      const senderKeypair = Keypair.fromSecretKey(bs58.decode(privKeyBase58));
      const senderPubkey = senderKeypair.publicKey;

      const balance = await connection.getBalance(senderPubkey);

      // Skip if no balance or too little to cover fees (~5000 lamports)
      if (balance < 5000) {
        results.push({
          wallet: senderPubkey.toBase58(),
          status: "skipped - insufficient balance",
        });
        continue;
      }

      const transaction = new Transaction().add(
        SystemProgram.transfer({
          fromPubkey: senderPubkey,
          toPubkey: recipientPubKey,
          lamports: balance - 5000, // leave some lamports for tx fee
        })
      );

      transaction.feePayer = senderPubkey;
      const { blockhash } = await connection.getLatestBlockhash("finalized");
      transaction.recentBlockhash = blockhash;

      try {
        const signature = await sendAndConfirmTransaction(
          connection,
          transaction,
          [senderKeypair]
        );
        results.push({
          wallet: senderPubkey.toBase58(),
          status: "success",
          signature,
        });
      } catch (txErr) {
        console.error(`Failed to send from ${senderPubkey.toBase58()}:`, txErr);
        results.push({
          wallet: senderPubkey.toBase58(),
          status: "failed",
          error: txErr.message,
        });
      }
    }

    res.json({ results });
  } catch (err) {
    console.error("Fatal error:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

export default reclaimSolRouter;
