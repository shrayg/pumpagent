import express from "express";
import axios from "axios";
import {
  getRandomPriority,
  getRandomProxy,
  getRandomUserAgent,
} from "../utils/helpers.js";
import { HttpsProxyAgent } from "https-proxy-agent";
import { requestTracker } from "../utils/requests.js";

const dexPaidRouter = express.Router();

dexPaidRouter.post("/", async (req, res) => {
  const { ca } = req.body;
  requestTracker.totalRequests++;

  try {
    const config = {
      headers: {
        accept: "*/*",
        "accept-language": "en,nl-NL;q=0.9,nl;q=0.8,en-US;q=0.7",
        "content-type": "application/json",
        origin: "https://dexscreener.com",
        referer: "https://dexscreener.com",
        "user-agent": getRandomUserAgent(),
      },
      agent: new HttpsProxyAgent(getRandomProxy()),
    };

    const dexRequest = await axios.get(
      `https://api.dexscreener.com/orders/v1/solana/${ca}`,
      config
    );

    const paidProfile = dexRequest.data.find(
      (payment) => payment.type === "tokenProfile"
    );

    res.json({ dexPaid: paidProfile ? true : false });
  } catch (err) {
    console.error(err);
  }
});

export default dexPaidRouter;
