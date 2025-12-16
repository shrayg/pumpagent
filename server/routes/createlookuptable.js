import express from "express";
import {
  AddressLookupTableProgram,
  PublicKey,
  SystemProgram,
  TransactionMessage,
  VersionedTransaction,
  ComputeBudgetProgram,
} from "@solana/web3.js";
import {
  devnetSolConnection,
  heliusConnection,
  solConnection,
} from "../utils/constants.js";
import { LAMPORTS_PER_SOL } from "@solana/web3.js";
import { requestTracker } from "../utils/requests.js";
import {
  getCachedBlockhash,
  getPriorityFeeEstimate,
} from "../utils/helpers.js";
import bs58 from "bs58";

const createLookupTableRouter = express.Router();

createLookupTableRouter.post("/", async (req, res) => {
  try {
    const { creator, prioFee = null } = req.body;
    const tier = req.tier;

    requestTracker.totalRequests++;

    // Validate input
    if (!creator) {
      return res
        .status(400)
        .json({ error: "Missing 'creator' in request body" });
    }

    let signerPublicKey;
    try {
      signerPublicKey = new PublicKey(creator);
    } catch (err) {
      return res.status(400).json({ error: "Invalid 'creator' public key" });
    }

    // Validate tier and platform fee
    const PLATFORM_FEE =
      tier === "Apprentice"
        ? parseFloat(process.env.CREATE_LUT_FEE)
        : req.tier === "God"
        ? parseFloat(process.env.GOD_FEE_PERCENTAGE)
        : parseFloat(process.env.ALCHEMIST_CREATE_LUT_FEE);

    // Create lookup table instruction
    const recentSlot = await heliusConnection().getSlot();
    const [lookupTableInst, lookupTableAddress] =
      AddressLookupTableProgram.createLookupTable({
        authority: signerPublicKey,
        payer: signerPublicKey,
        recentSlot,
      });

    const { blockhash } = await heliusConnection().getLatestBlockhash(
      "finalized"
    );

    const wantsPrio = ["Low", "Medium", "High", "VeryHigh"].includes(prioFee);

    const feeInstruction = SystemProgram.transfer({
      fromPubkey: signerPublicKey,
      toPubkey: new PublicKey(process.env.FEE_WALLET),
      lamports: BigInt(PLATFORM_FEE * LAMPORTS_PER_SOL),
    });

    const messageV0 = new TransactionMessage({
      payerKey: signerPublicKey,
      recentBlockhash: blockhash,
      instructions: [lookupTableInst, feeInstruction],
    }).compileToV0Message();

    const tx = new VersionedTransaction(messageV0);
    const serializedTransaction = Buffer.from(tx.serialize()).toString(
      "base64"
    );

    // Return early if no priority fee requested
    if (!wantsPrio) {
      return res.json({
        serializedTransaction,
        lut: lookupTableAddress.toBase58(),
      });
    }

    // Add priority fee
    const encodedTx = bs58.encode(tx.serialize());
    const microLamports = await getPriorityFeeEstimate(encodedTx, prioFee);
    const prioIx = ComputeBudgetProgram.setComputeUnitPrice({ microLamports });

    const updatedInstructions = [prioIx, lookupTableInst, feeInstruction];
    const { blockhash: newHash } = await heliusConnection().getLatestBlockhash(
      "finalized"
    );

    console.log("Updated hash: ", newHash);

    const message = new TransactionMessage({
      payerKey: signerPublicKey,
      recentBlockhash: newHash,
      instructions: updatedInstructions,
    }).compileToV0Message();

    const prioTx = new VersionedTransaction(message);
    const serialized = Buffer.from(prioTx.serialize()).toString("base64");
    return res.json({
      serializedTransaction: serialized,
      lut: lookupTableAddress.toBase58(),
    });
  } catch (error) {
    console.error("Error in createLookupTableRouter:", error);
    return res.status(500).json({
      error: "Internal server error",
      details: error?.message || "Unknown error",
    });
  }
});

export default createLookupTableRouter;
