import express from "express";
import supabase from "../utils/supabase.js";
import { requestTracker } from "../utils/requests.js";
import jwt from "jsonwebtoken";
const updateKolTradeStrategies = express.Router();

updateKolTradeStrategies.post("/", async (req, res) => {
  try {
    const { proof, strategies, settings } = req.body;
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
    const trimmedName = settings.strategyName.trim().toLowerCase();

    // Remove any existing strategy with the same name
    const currentStrategies = Array.from(strategies).filter(
      (strategy) => strategy.strategyName?.toLowerCase().trim() !== trimmedName
    );

    // Add the new (or updated) strategy
    currentStrategies.push(settings);

    // Update strategies
    const { error } = await supabase
      .from("koltrader")
      .update({ strategy: currentStrategies })
      .eq("username", user);

    if (error) return res.json(error);

    return res.json({ updated: currentStrategies });
  } catch (error) {
    console.error("Error in loadKolTraderRouter:", error);
    return res.status(500).json({
      error: "Internal server error",
      details: error?.message || "Unknown error",
    });
  }
});

export default updateKolTradeStrategies;
