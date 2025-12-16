import express from "express";
import { requestTracker } from "../utils/requests.js";
import { tradesCacheMap } from "../utils/tradescache.js";
import { heliusRPCURL } from "../utils/constants.js";
import axios from "axios";
import { getCoinData, getTokenCurve } from "../utils/helpers.js";

import anchor from "@coral-xyz/anchor";
import { PublicKey, Keypair } from "@solana/web3.js";
import { solConnection } from "../utils/constants.js";
import IDL from "../utils/pumpfun-IDL.json" with { type: "json" };

const loadOpenPositionsRouter = express.Router();

const calculateSolReceivedForSell = ({ tokenReserves, solReserves }) =>
  Number(solReserves) / 1e9 / (Number(tokenReserves) / 10 ** 6);

const getQuote = async (mint, amount, PLATFORM_FEE) => {
  const res = await fetch(
    `https://lite-api.jup.ag/swap/v1/quote?inputMint=${mint}&outputMint=So11111111111111111111111111111111111111112&amount=${amount}&slippageBps=0&restrictIntermediateTokens=true&platformFeeBps=${PLATFORM_FEE}`
  );
  const json = await res.json();
  return json.outAmount ? json.outAmount / 1e9 : null;
};

loadOpenPositionsRouter.post("/", async (req, res) => {
  try {
    const { wallet } = req.body;
    requestTracker.totalRequests++;

    const cachedTrades = tradesCacheMap.get(wallet);

    const provider = new anchor.AnchorProvider(
      solConnection(),
      new anchor.Wallet(Keypair.generate()),
      { commitment: "confirmed" }
    );

    // Init program
    const program = new anchor.Program(IDL, provider);

    // Check wallet balances
    const response = await axios.post(
      heliusRPCURL(),
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
    // Token accounts for held tokens
    const tokenAccounts = response?.data?.result?.value || [];

    // Parse balances
    const token = tokenAccounts.map((account) => {
      const info = account?.account?.data?.parsed?.info;
      if(!info) return null;
      if (Number(info.tokenAmount.uiAmount < 1)) {
        return null;
      }
      return {
        mint: info.mint,
        amount: Number(info.tokenAmount.amount),
        decimals: info.tokenAmount.decimals,
      };
    });

    const tokens = token.filter(Boolean);

    // Mint addresses for held tokens
    const currentMints = tokens.map((token) => token.mint);

    // Get all metadata + bonding curve state for mints
    const coinData = await Promise.allSettled(
      currentMints.map(async (mint) => await getCoinData(mint))
    );

    const tokenDataMap = {};
    coinData.forEach((r) => {
      if (r.status === "fulfilled") {
        const { mint } = r.value;
        tokenDataMap[mint] = r.value;
      }
    });
    // Get images and bonding curves for tokens
    const finalData = await Promise.all(
      currentMints.map(async (mint) => {
        const data = tokenDataMap[mint];
        const held = tokens.find((t) => t.mint === mint).amount;
        const migrated = (await getTokenCurve(mint, program)).complete;

        return {
          mint,
          name: data?.name,
          symbol: data?.symbol,
          image: data?.image_uri || "",
          tokens: held,
          migrated,
        };
      })
    );

    console.log("Parsed amounts: ", finalData);

    const heldTrades = finalData.map((trade) => {
      // Held tokens for mint
      const chainTokenAmount = trade.tokens;
      // Matching mint in storage
      const match = cachedTrades?.[trade.mint];

      console.log("MATCH!", match);
      const matchTokenAmount = match?.tokens;
      if (match) {
        match.tokens = chainTokenAmount;
        return match;
      }

      if (!match) {
        const position = {
          ...trade,
          position: "N/A",
          timestamp: Date.now(),
        };
        return position;
      }
    });
    console.log("Held trades: ", heldTrades);

    return res.json(heldTrades);
  } catch (error) {
    console.error("Error in loadKolTraderRouter:", error);
    return res.status(500).json({
      error: "Internal server error",
      details: error?.message || "Unknown error",
    });
  }
});

export default loadOpenPositionsRouter;
