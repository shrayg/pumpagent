import express from "express";
import axios from "axios";
import { requestTracker } from "../utils/requests.js";
const pumpTokenInfoRouter = express.Router();

pumpTokenInfoRouter.post("/", async (req, res) => {
  requestTracker.totalRequests++;
  try {
    const { ca } = req.body;
    const config = {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:125.0) Gecko/20100101 Firefox/125.0",
        Accept: "*/*",
        "Accept-Language": "en-US,en;q=0.5",
        "Accept-Encoding": "gzip, deflate, br",
        Referer: "https://www.pump.fun/",
        Origin: "https://www.pump.fun",
        Connection: "keep-alive",
        "Sec-Fetch-Dest": "empty",
        "Sec-Fetch-Mode": "cors",
        "Sec-Fetch-Site": "cross-site",
        "If-None-Match": 'W/"43a-tWaCcS4XujSi30IFlxDCJYxkMKg"',
      },
    };

    const response = await axios.get(
      `https://frontend-api-v3.pump.fun/coins/${ca}`,
      config
    );
    res.json({ response: response.data });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

export default pumpTokenInfoRouter;
