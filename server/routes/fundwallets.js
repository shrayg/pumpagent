import express from "express";
import {
  PublicKey,
  SystemProgram,
  TransactionMessage,
  VersionedTransaction,
} from "@solana/web3.js";
import { heliusConnection, solConnection } from "../utils/constants.js";
import { requestTracker } from "../utils/requests.js";
import { getCachedBlockhash } from "../utils/helpers.js";
const fundWalletsRouter = express.Router();

fundWalletsRouter.post("/", async (req, res) => {
  const { funderPubKey, wallets } = req.body;
  requestTracker.totalRequests++;

  const PLATFORM_FEE =
    req.tier === "Apprentice"
      ? process.env.FUND_WALLETS_FEE
      : req.tier === "God"
      ? parseFloat(process.env.GOD_FEE_PERCENTAGE)
      : process.env.ALCHEMIST_FUND_WALLETS_FEE;

  const funder = new PublicKey(funderPubKey);

  const { blockhash } = await heliusConnection().getLatestBlockhash(
    "finalized"
  );
  const transferInstructions = wallets.map((wallet) => {
    return SystemProgram.transfer({
      fromPubkey: funder,
      toPubkey: new PublicKey(wallet.publicKey),
      lamports: parseInt(Number(wallet.amount) * 1e9),
    });
  });

  //Collect fee
  transferInstructions.push(
    SystemProgram.transfer({
      fromPubkey: funder,
      toPubkey: new PublicKey(process.env.FEE_WALLET),
      lamports: BigInt(Math.floor(PLATFORM_FEE * 1e9)),
    })
  );

  const messageV0 = new TransactionMessage({
    payerKey: funder,
    recentBlockhash: blockhash,
    instructions: transferInstructions,
  }).compileToV0Message();
  const transaction = new VersionedTransaction(messageV0);

  const serializedTransaction = Buffer.from(transaction.serialize()).toString(
    "base64"
  );

  res.json({ serializedTransaction });
});

export default fundWalletsRouter;
