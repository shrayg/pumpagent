import express from "express";
import supabase from "../utils/supabase.js";
import { requestTracker } from "../utils/requests.js";
import jwt from "jsonwebtoken";
const loadKolTraderRouter = express.Router();

loadKolTraderRouter.post("/", async (req, res) => {
  try {
    const { proof } = req.body;
    requestTracker.totalRequests++;

    // Validate input
    if (!proof) {
      return res
        .status(400)
        .json({ error: "Missing paramaters in request body" });
    }

    const decoded = jwt.decode(proof, { complete: true });
    if (!decoded) throw new Error("Invalid withdrawal.");

    const user = decoded.payload.email.split("@")[0];

    // Get API key
    const { data, error } = await supabase
      .from("users")
      .select("api_key")
      .eq("username", user);

    if (error) return res.json(error);
    const apiKey = data[0].api_key;

    // Get Trade wallet
    const { data: tradeData, error: tradeError } = await supabase
      .from("koltrader")
      .select("pubKey, strategy")
      .eq("username", user);

    if (tradeError) return res.json(tradeError);
    const pubKey = tradeData[0]?.pubKey;
    let strategy;

    try {
      strategy = JSON.parse(tradeData[0].strategy);
    } catch (e) {
      strategy = tradeData[0].strategy; // fallback to raw value if not JSON
    }

    return res.json({ apiKey, pubKey, strategy });
  } catch (error) {
    console.error("Error in loadKolTraderRouter:", error);
    return res.status(500).json({
      error: "Internal server error",
      details: error?.message || "Unknown error",
    });
  }
});

export default loadKolTraderRouter;
