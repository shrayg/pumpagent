import express from "express";
import axios from "axios";
import { solConnection, solRPCURL, USDC_MINT } from "../utils/constants.js";
import { getAccount, getAssociatedTokenAddress } from "@solana/spl-token";
import { PublicKey } from "@solana/web3.js";

const getWalletBalanceRouter = express.Router();

getWalletBalanceRouter.post("/", async (req, res) => {
  const { wallet } = req.body;

  if (!wallet) {
    return res.status(400).json({ error: "Wallet address is required." });
  }
  const result = {
    SOL: 0,
    USDC: 0,
  };

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
    result.SOL = solBalance;

    const userPubKey = new PublicKey(wallet);
    const ata = await getAssociatedTokenAddress(USDC_MINT, userPubKey);
    const accountData = await getAccount(solConnection(), ata, "confirmed");
    const usdcBalance = Math.floor(Number(accountData?.amount) / 1e6) ?? 0;
    result.USDC = usdcBalance;

    res.json(result);
  } catch (err) {
    res.status(200).json(result);
  }
});

export default getWalletBalanceRouter;
