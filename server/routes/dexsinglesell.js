import express from "express";
import { requestTracker } from "../utils/requests.js";
const dexSingleSellRouter = express.Router();

dexSingleSellRouter.post("/", async (req, res) => {
  const { recipient, ca, tokenAmount, prioFee = "high", slippage } = req.body;
  requestTracker.totalRequests++;

  const PLATFORM_FEE =
    req.tier === "Apprentice"
      ? parseFloat(process.env.DEX_FEE)
      : req.tier === "God"
      ? parseFloat(process.env.GOD_FEE_PERCENTAGE)
      : parseFloat(process.env.DEX_FEE_ALCHEMIST);

  try {
    const amount = Number(tokenAmount) * 1e6;
    const finalSlippage = slippage ? Number(slippage) * 100 : 0;
    const newQuote = await (
      await fetch(
        `https://lite-api.jup.ag/swap/v1/quote?inputMint=${ca}&outputMint=So11111111111111111111111111111111111111112&amount=${amount}&slippageBps=${finalSlippage}&restrictIntermediateTokens=true&platformFeeBps=${PLATFORM_FEE}`
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
    console.log(swapResponse);
    res.json({ serializedTransaction });
  } catch (err) {
    console.error(err);
  }
});

export default dexSingleSellRouter;
