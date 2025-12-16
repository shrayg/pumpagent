import express from "express";
import axios from "axios";
import { requestTracker } from "../utils/requests.js";
import { getRandomProxy, getRandomUserAgent } from "../utils/helpers.js";
import { HttpsProxyAgent } from "https-proxy-agent";

const pumpswapCandlesRouter = express.Router();

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
    // console.log("Fetched new SOL price:", cachedSolPrice);
  } else {
    // console.log("Using cached SOL price:", cachedSolPrice);
  }
  return cachedSolPrice;
}

// Route to fetch candlesticks for swap.pump.fun
pumpswapCandlesRouter.post("/", async (req, res) => {
  requestTracker.totalRequests++;
  const { pool, creationTime } = req.body;

  if (!pool) {
    return res.status(400).json({ error: "Missing required 'pool' field" });
  }

  try {
    const config = {
      params: {
        interval: "1m",
        limit: 1000,
        currency: "SOL",
        before_ts: creationTime,
      },
      headers: {
        accept: "*/*",
        "accept-language": "en-US,en;q=0.9",
        "if-none-match": "",
        priority: "u=1, i",
        "sec-ch-ua":
          '"Google Chrome";v="137", "Chromium";v="137", "Not/A)Brand";v="24"',
        "sec-ch-ua-mobile": "?0",
        "sec-ch-ua-platform": '"Windows"',
        "sec-fetch-dest": "empty",
        "sec-fetch-mode": "cors",
        "sec-fetch-site": "same-site",
        Referer: "https://swap.pump.fun/",
        "Referrer-Policy": "strict-origin-when-cross-origin",
      },
      // httpsAgent: new HttpsProxyAgent(getRandomProxy()),
    };

    const response = await axios.get(
      `https://swap-api.pump.fun/v1/pools/${pool}/candles`,
      config
    ); // Eh8dSx4kDhfmM7JrXLNkHZdqNZCQ5GubuPhHZGPtyZfm
    const SOL_PRICE = await getCachedSolPrice();
    const chartData = response.data.map((candle) => ({
      time: candle.timestamp,
      open: candle.open * Number(SOL_PRICE),
      high: candle.high * Number(SOL_PRICE),
      low: candle.low * Number(SOL_PRICE),
      close: candle.close * Number(SOL_PRICE),
      volume: candle.volume,
    }));

    res.json(chartData);
  } catch (error) {
    console.error("Error fetching swap candles:", error.message);
    res.status(500).json({ error: error.message });
  }
});

export default pumpswapCandlesRouter;
