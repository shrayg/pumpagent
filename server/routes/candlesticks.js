import express from "express";
import axios from "axios";
import { requestTracker } from "../utils/requests.js";
import { getRandomProxy, getRandomUserAgent } from "../utils/helpers.js";
import { HttpsProxyAgent } from "https-proxy-agent";

const candlesticksRouter = express.Router();

// Cache object for SOL price
let cachedSolPrice = null;
let lastFetchTime = 0;

async function getCachedSolPrice() {
  const now = Date.now();
  if (!cachedSolPrice || now - lastFetchTime > 60_000) {
    const res = await axios.get("https://lite-api.jup.ag/price/v2", {
      params: {
        ids: "So11111111111111111111111111111111111111112",
        vsToken: "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v",
      },
    });

    const solPrice =
      +res.data.data["So11111111111111111111111111111111111111112"].price;
    const formatted = +solPrice.toFixed(6).split(".").join("");

    cachedSolPrice = formatted;
    lastFetchTime = now;
  } 
  return cachedSolPrice;
}

candlesticksRouter.post("/", async (req, res) => {
  requestTracker.totalRequests++;
  const { ca } = req.body;

  try {
    const config = {
      headers: {
        "content-type": "application/json",
        "sec-fetch-dest": "empty",
        "sec-fetch-mode": "cors",
        "sec-fetch-site": "same-site",
        Referer: "https://pump.fun/",
        "Referrer-Policy": "strict-origin-when-cross-origin",
      },
    };

    const response = await axios.get(
      `https://frontend-api-v3.pump.fun/candlesticks/${ca}?offset=0&limit=1000`,
      config
    );
  
    const SOL_PRICE = await getCachedSolPrice();
    
    const chartData = response.data.map((c) => ({
      time: c.timestamp,
      open: c.open * Number(SOL_PRICE),
      high: c.high * Number(SOL_PRICE),
      low: c.low * Number(SOL_PRICE),
      close: c.close * Number(SOL_PRICE),
    }));

    res.json(chartData);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default candlesticksRouter;
