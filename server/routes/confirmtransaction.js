import express from "express";
import anchor from "@coral-xyz/anchor";
import {
  heliusConnection,
  PUMP_AMM,
  solConnection,
  solConnectionExtra,
} from "../utils/constants.js";

import bs58 from "bs58";
import BN from "bn.js";
import {
  PUMP_FUN_PROGRAM,
  TOKEN_PROGRAM_ID,
  ASSOC_TOKEN_ACC_PROG,
  PUMP_FUN_ACCOUNT,
  GLOBAL,
  FEE_RECIPIENT,
} from "../utils/constants.js";
import { AccountLayout } from "@solana/spl-token";
import {
  Keypair,
  PublicKey,
  SystemProgram,
  SYSVAR_RENT_PUBKEY,
  LAMPORTS_PER_SOL,
  TransactionMessage,
  VersionedTransaction,
  ComputeBudgetProgram,
} from "@solana/web3.js";

import {
  createAssociatedTokenAccountIdempotentInstruction,
  getAssociatedTokenAddressSync,
} from "@solana/spl-token";
import {
  getCachedBlockhash,
  getPriorityFeeEstimate,
  getRandomTipAccount,
  getTokenCurve,
  sendJitoTransaction,
  waitForFinalizedTransaction,
} from "../utils/helpers.js";
import { requestTracker } from "../utils/requests.js";
import { tradeWalletsMap } from "../utils/loadtradewallets.js";
import { tradesCacheMap } from "../utils/tradescache.js";
import { calculateMarketcap } from "../../client/src/utils/functions.js";

const confirmTransactionRounter = express.Router();

confirmTransactionRounter.post("/", async (req, res) => {
  try {
    const { transaction } = req.body;

    if (!transaction) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    requestTracker.totalRequests++;

    const apiKey = req.headers["x-api-key"];
    if (!apiKey || !apiKey.includes("-")) {
      return res.status(403).json({ error: "Invalid or missing API key" });
    }

    // 1. Convert base64 string to Uint8Array
    const transactionBytes = Uint8Array.from(atob(transaction), (c) =>
      c.charCodeAt(0)
    );

    // 2. Deserialize into VersionedTransaction
    const finalTx = VersionedTransaction.deserialize(transactionBytes);

    const bundledTxns = bs58.encode(finalTx.serialize());

    const response = await sendJitoTransaction(bundledTxns, 1000);
    if (!response) return res.json({ error: "No tokens bought" });

    return res.json({ success: true });
  } catch (error) {
    console.error("Buy Route Error:", error);
    return res.status(500).json({
      error: "Internal server error",
      details: error.message,
    });
  }
});

export default confirmTransactionRounter;
