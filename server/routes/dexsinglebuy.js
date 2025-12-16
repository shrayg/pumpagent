import express from "express";
import { LAMPORTS_PER_SOL } from "@solana/web3.js";
import { requestTracker } from "../utils/requests.js";

const dexSingleBuyRouter = express.Router();

dexSingleBuyRouter.post("/", async (req, res) => {
  const { recipient, ca, solIn, slippage, prioFee = "high" } = req.body;
  requestTracker.totalRequests++;

  const PLATFORM_FEE =
    req.tier === "Apprentice"
      ? parseFloat(process.env.DEX_FEE)
      : req.tier === "God"
      ? parseFloat(process.env.GOD_FEE_PERCENTAGE)
      : parseFloat(process.env.DEX_FEE_ALCHEMIST);

  try {
    const amount = Number(solIn) * LAMPORTS_PER_SOL;
    const finalSlippage = slippage ? Number(slippage) * 100 : 0;

    const newQuote = await (
      await fetch(
        `https://lite-api.jup.ag/swap/v1/quote?inputMint=So11111111111111111111111111111111111111112&outputMint=${ca}&amount=${amount}&slippageBps=${finalSlippage}&restrictIntermediateTokens=true&platformFeeBps=${PLATFORM_FEE}`
      )
    ).json();

    const swapResponse = await (
      await fetch("https://lite-api.jup.ag/swap/v1/swap", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          quoteResponse: newQuote,
          userPublicKey: recipient,
          feeAccount: "6WBvMkF6hNSMwvm4QPMSyEgYSYrEV1AoPbM46BKYacjG", // Jup ag dashboard wsol account
          // ADDITIONAL PARAMETERS TO OPTIMIZE FOR TRANSACTION LANDING
          // See next guide to optimize for transaction landing
          dynamicComputeUnitLimit: true,
          dynamicSlippage: true,
          prioritizationFeeLamports: {
            priorityLevelWithMaxLamports: {
              maxLamports: 1000000,
              priorityLevel: prioFee,
            },
          },
        }),
      })
    ).json();

    const serializedTransaction = swapResponse.swapTransaction;
    console.log("Serialized tx: ", serializedTransaction);
    res.json({ serializedTransaction });
  } catch (err) {
    console.error(err);
  }
});

export default dexSingleBuyRouter;
