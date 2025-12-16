import express from "express";
import bs58 from "bs58";
import { VersionedTransaction } from "@solana/web3.js";

import { sendJitoBundle } from "../utils/helpers.js";
import { requestTracker } from "../utils/requests.js";

const confirmBundleRouter = express.Router();

confirmBundleRouter.post("/", async (req, res) => {
  try {
    const { bundle } = req.body;

    if (!Array.isArray(bundle) || bundle.length === 0) {
      return res.status(400).json({ error: "Missing or invalid 'bundle'" });
    }

    requestTracker.totalRequests++;

    const apiKey = req.headers["x-api-key"];
    if (!apiKey || !apiKey.includes("-")) {
      return res.status(403).json({ error: "Invalid or missing API key" });
    }

    // Decode base64 transactions into VersionedTransaction objects
    const transactions = bundle.map((base64Tx) => {
      const txBytes = Buffer.from(base64Tx, "base64");
      return VersionedTransaction.deserialize(txBytes);
    });

    // Optionally: Re-serialize into bs58 for sending via Jito if needed
    const encodedTransactions = transactions.map((tx) =>
      bs58.encode(tx.serialize())
    );

    const response = await sendJitoBundle(encodedTransactions, 1000);
    console.log("BUNDLE RESPONSE: ", response);
    if (!response) return res.json({ error: "Failed to confirm bundle." });
    if (response === "Network congested. Endpoint is globally rate limited.")
      return res.json({ error: response });

    return res.json({ success: response });
  } catch (error) {
    console.error("Buy Route Error:", error);
    return res.status(500).json({
      error: "Internal server error",
      details: error.message,
    });
  }
});

export default confirmBundleRouter;
