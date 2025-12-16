import express from "express";
import axios from "axios";
import { requestTracker } from "../utils/requests.js";
import { heliusRPCURL } from "../utils/constants.js";

const getAssetInfoRouter = express.Router();

getAssetInfoRouter.post("/", async (req, res) => {
  requestTracker.totalRequests++;
  try {
    const mint = req.body.ca;
    if (!mint || typeof mint !== "string") {
      return res
        .status(400)
        .json({ error: "Missing or invalid 'mint' in body" });
    }

    const heliusURL = heliusRPCURL(); // e.g., "https://mainnet.helius-rpc.com/"

    const response = await axios.post(
      heliusURL,
      {
        jsonrpc: "2.0",
        id: "1",
        method: "getAsset",
        params: { id: mint },
      },
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    console.log(response.data);
    res.json(response.data); // Return the Helius response
  } catch (error) {
    console.error("Error:", error.response?.data || error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

export default getAssetInfoRouter;
