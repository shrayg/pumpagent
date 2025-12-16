import express from "express";
import axios from "axios";
import { heliusRPCURL } from "../utils/constants.js";
import { requestTracker } from "../utils/requests.js";
import { PublicKey } from "@solana/web3.js";
import { getAssociatedTokenAddress, AccountLayout } from "@solana/spl-token";

const getMintBalancesForHolders = express.Router();

const getMintBalances = async (addresses) => {
  try {
    const response = await fetch(heliusRPCURL(), {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        jsonrpc: "2.0",
        id: 1,
        method: "getMultipleAccounts",
        params: [
          addresses,
          {
            encoding: "base64",
          },
        ],
      }),
    });

    const data = await response.json();
    // Decode each account's data
    const balances = data.result.value.map((account) => {
      if (account && account.data[0]) {
        const buffer = Buffer.from(account.data[0], "base64");
        const tokenAccount = AccountLayout.decode(buffer);
        return Number(tokenAccount.amount);
      }
      return 0;
    });

    return balances;
  } catch (error) {
    console.error("Error:", error);
    throw error;
  }
};

const getTokenAccount = async (mint, wallet) => {
  const ata = await getAssociatedTokenAddress(
    new PublicKey(mint),
    new PublicKey(wallet)
  );
  return ata.toBase58();
};

getMintBalancesForHolders.post("/", async (req, res) => {
  const { wallets, ca } = req.body;
  requestTracker.totalRequests++;

  try {
    const ataArray = await Promise.all(
      wallets.map((wallet) => getTokenAccount(ca, wallet))
    );

    const result = await getMintBalances(ataArray);
    res.json(result);
  } catch (err) {
    console.error(
      "Error fetching token accounts:",
      err?.response?.data || err.message
    );
    res.status(500).json({ error: "Failed to fetch token account balances" });
  }
});

export default getMintBalancesForHolders;
