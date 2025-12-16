import express from "express";
import axios from "axios";

import { solRPCURL } from "../utils/constants.js";

const getTokenBalancesRouter = express.Router();

getTokenBalancesRouter.post("/", async (req, res) => {
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
        method: "getTokenAccountsByOwner",
        params: [
          wallet,
          {
            programId: "TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA", // SPL Token program
          },
          {
            encoding: "jsonParsed",
          },
        ],
      },
      {
        headers: { "Content-Type": "application/json" },
      }
    );
    const tokenAccounts = response?.data?.result?.value || [];

    // 3. Parse balances
    const tokens = tokenAccounts.map((account) => {
      const info = account.account.data.parsed.info;
      return {
        mint: info.mint,
        amount: Number(info.tokenAmount.amount),
        uiAmount: Number(info.tokenAmount.uiAmount),
        decimals: info.tokenAmount.decimals,
      };
    });
    // console.log(tokens);

    res.json(tokens);
  } catch (err) {
    res.status(200).json({ error: "Failed to get wallet balance." });
  }
});

export default getTokenBalancesRouter;
