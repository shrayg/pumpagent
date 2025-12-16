import express from "express";
import axios from "axios";
import { heliusRPCURL } from "../utils/constants.js";
import { requestTracker } from "../utils/requests.js";
import { PublicKey } from "@solana/web3.js";

const getHoldersForMintRouter = express.Router();

getHoldersForMintRouter.post("/", async (req, res) => {
  const { mint } = req.body;
  requestTracker.totalRequests++;

  if (!mint || typeof mint !== "string") {
    return res.status(400).json({ error: "Missing or invalid 'mint' in body" });
  }

  const heliusURL = heliusRPCURL();

  const payload = {
    jsonrpc: "2.0",
    id: 10,
    method: "getProgramAccounts",
    params: [
      "TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA", // SPL Token Program
      {
        encoding: "jsonParsed",
        filters: [
          { dataSize: 165 },
          {
            memcmp: {
              offset: 0,
              bytes: mint,
            },
          },
        ],
      },
    ],
  };

  try {
    const config = {
      headers: {
        "Content-Type": "application/json",
      },
    };

    const response = await axios.post(heliusURL, payload, config);

    const results = response.data.result || [];

    const accounts = results.map((account) => {
      const info = account.account.data.parsed.info;
      return {
        owner: info.owner,
        balance: info.tokenAmount.amount,
      };
    });

    res.json({ accounts });
  } catch (err) {
    console.error(
      "Error fetching token accounts:",
      err?.response?.data || err.message
    );
    res.status(500).json({ error: "Failed to fetch token account balances" });
  }
});

export default getHoldersForMintRouter;
