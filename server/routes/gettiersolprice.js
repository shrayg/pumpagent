import express from "express";
import axios from "axios";
import { WSOL_ADDRESS } from "../utils/constants.js";

const getTierSolPriceRouter = express.Router();

getTierSolPriceRouter.get("/", async (req, res) => {
  try {
    const res = await axios.get("https://lite-api.jup.ag/price/v2", {
      params: {
        ids: "So11111111111111111111111111111111111111112",
        vsToken: "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v",
      },
    });

    const SOL_PRICE = parseFloat(
      res.data.data["So11111111111111111111111111111111111111112"].price
    );
    const solPrice = Number(
      (process.env.TIER_PRICE_USD / SOL_PRICE).toFixed(2)
    );

    res.json({ solPrice });
  } catch (err) {
    console.error("Error fetching price data:", err.message);
    res.status(500).json({ error: "Failed to fetch price data." });
  }
});

export default getTierSolPriceRouter;
