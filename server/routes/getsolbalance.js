import express from "express";
import axios from "axios";
import { solRPCURL } from "../utils/constants.js";

const getSolBalancesRouter = express.Router();

getSolBalancesRouter.post("/", async (req, res) => {
  const { wallet } = req.body;

  if (!wallet) {
    return res.status(400).json({ error: "Wallet address is required." });
  }

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
    const bal = response?.data?.result?.value?.lamports;
    const solBalance = bal ? bal / 1e9 : 0;

    res.json({ solBalance });
  } catch (err) {
    res.status(200).json({ error: "Failed to get wallet balance." });
  }
});

export default getSolBalancesRouter;
