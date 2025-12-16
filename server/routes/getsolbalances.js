import express from "express";
import axios from "axios";
import { solRPCURL } from "../utils/constants.js";

const getSolBalanceRouter = express.Router();

getSolBalanceRouter.post("/", async (req, res) => {
  const { wallets } = req.body;
  if (!Array.isArray(wallets) || wallets.length === 0) {
    return res
      .status(400)
      .json({ error: "Array of wallet addresses is required." });
  }

  try {
    const balancePromises = wallets.map(async (wallet) => {
      try {
        const response = await axios.post(
          solRPCURL(),
          {
            jsonrpc: "2.0",
            id: 1,
            method: "getAccountInfo",
            params: [wallet, { encoding: "base58" }],
          },
          {
            headers: { "Content-Type": "application/json" },
          }
        );
        const lamports = response?.data?.result?.value?.lamports || 0;
        return lamports / 1e9;
      } catch (err) {
        return { wallet, error: "Failed to fetch balance." };
      }
    });

    const balances = await Promise.all(balancePromises);

    res.json({ balances });
  } catch (err) {
    res.status(500).json({ error: "Unexpected server error." });
  }
});

export default getSolBalanceRouter;
