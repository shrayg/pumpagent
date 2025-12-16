import express from "express";
import supabase from "../utils/supabase.js";
import { requestTracker } from "../utils/requests.js";
import jwt from "jsonwebtoken";
import { tradeWalletsMap } from "../utils/loadtradewallets.js";
const createKolTradeWalletRouter = express.Router();

createKolTradeWalletRouter.post("/", async (req, res) => {
  try {
    const { pubKey, privKey, proof } = req.body;
    requestTracker.totalRequests++;

    // Validate input
    if (!pubKey || !privKey || !proof) {
      return res
        .status(400)
        .json({ error: "Missing paramaters in request body" });
    }

    const decoded = jwt.decode(proof, { complete: true });
    if (!decoded) throw new Error("Invalid withdrawal.");

    const user = decoded.payload.email.split("@")[0];

    const { error } = await supabase.from("koltrader").insert({
      username: user,
      pubKey: pubKey,
      privKey: privKey,
    });

    // Update API server memory
    tradeWalletsMap.set(user, privKey);

    if (error) return res.json(error);

    return res.json({ success: true });
  } catch (error) {
    console.error("Error in createKolTradeWalletRouter:", error);
    return res.status(500).json({
      error: "Internal server error",
      details: error?.message || "Unknown error",
    });
  }
});

export default createKolTradeWalletRouter;
