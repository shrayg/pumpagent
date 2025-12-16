import express from "express";
import {
  Keypair,
  SystemProgram,
  LAMPORTS_PER_SOL,
  VersionedTransaction,
  TransactionMessage,
  AddressLookupTableAccount,
} from "@solana/web3.js";
import { requestTracker } from "../utils/requests.js";
import { tradeWalletsMap } from "../utils/loadtradewallets.js";
import { heliusConnection, solConnection } from "../utils/constants.js";
import { tradesCacheMap } from "../utils/tradescache.js";
import bs58 from "bs58";
import {
  getRandomTipAccount,
  sendJitoTransaction,
  waitForFinalizedTransaction,
} from "../utils/helpers.js";
const koltraderDEXSellRouter = express.Router();

koltraderDEXSellRouter.post("/", async (req, res) => {
  const { recipient, ca, tokenAmount, prioFee, slippage, coinData, jitoTip } =
    req.body;
  requestTracker.totalRequests++;

  const PLATFORM_FEE =
    req.tier === "Apprentice"
      ? parseFloat(process.env.DEX_FEE)
      : req.tier === "God"
      ? parseFloat(process.env.GOD_FEE_PERCENTAGE)
      : parseFloat(process.env.DEX_FEE_ALCHEMIST);

  const prioFeeMap = {
    Medium: "medium",
    High: "high",
    VeryHigh: "veryHigh",
  };

  const priority = prioFeeMap[prioFee] || "high";

  const traderKeypair = Keypair.fromSecretKey(
    bs58.decode(tradeWalletsMap.get(recipient))
  );

  try {
    const finalSlippage = slippage ? Number(slippage) * 100 : 0;
    const newQuote = await (
      await fetch(
        `https://lite-api.jup.ag/swap/v1/quote?inputMint=${ca}&outputMint=So11111111111111111111111111111111111111112&amount=${tokenAmount}&slippageBps=${finalSlippage}&restrictIntermediateTokens=true&platformFeeBps=${PLATFORM_FEE}`
      )
    ).json();

    if (newQuote.error) return res.json(newQuote);

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
              priorityLevel: priority,
            },
          },
        }),
      })
    ).json();

    const serializedTransaction = swapResponse.swapTransaction;
    const serialized = Uint8Array.from(
      Buffer.from(serializedTransaction, "base64")
    );

    const transaction = VersionedTransaction.deserialize(serialized);

    // Build tip instruction
    const jitoTipInstruction = SystemProgram.transfer({
      fromPubkey: traderKeypair.publicKey,
      toPubkey: getRandomTipAccount(),
      lamports: BigInt(jitoTip),
    });

    // Resolve address lookup tables (fetch ALT accounts from the blockchain)
    const addressTableLookups = transaction.message.addressTableLookups;

    const addressLookupTableAccounts = await Promise.all(
      addressTableLookups.map(async (lookup) => {
        const accountInfo = await heliusConnection().getAccountInfo(
          lookup.accountKey
        );
        if (!accountInfo) throw new Error("Failed to fetch ALT account");

        return new AddressLookupTableAccount({
          key: lookup.accountKey,
          state: AddressLookupTableAccount.deserialize(accountInfo.data),
        });
      })
    );

    // Decompile and add tip instruction
    const message = TransactionMessage.decompile(transaction.message, {
      addressLookupTableAccounts,
    });
    message.instructions.push(jitoTipInstruction);

    // Recompile and sign
    const compiled = message.compileToV0Message();
    const newTxn = new VersionedTransaction(compiled);
    newTxn.sign([traderKeypair]);

    const bundledTxns = bs58.encode(newTxn.serialize());

    const response = await sendJitoTransaction(bundledTxns);
    if (!response) return res.json({ error: "No tokens bought" });

    const usdSpend = newQuote.swapUsdValue;
    const tokens = newQuote.inAmount / 1e6;
    const pricePerToken = usdSpend / tokens;
    const marketCap = pricePerToken * 1_000_000_000;

    const txResult = {
      mint: ca,
      name: coinData.name,
      symbol: coinData.symbol,
      image: coinData.image,
      position: newQuote.inAmount, // Get from newQuote
      tokens: tokenAmount,
      exit: 0,
      type: "Sell",
      sol_received: Number(newQuote.outAmount), // Get from newQuote
      tokens_sold: tokenAmount,
      marketCap,
      timestamp: Date.now(),
      txid: response,
    };

    // Handle filtering for sells
    const userTrades = tradesCacheMap.get(recipient) || {};
    const tradeForMint = userTrades[ca];

    if (!tradeForMint) {
      // No existing trade for this mint - nothing to sell
      console.warn(`No trade found for mint ${ca} to sell from`);
      delete userTrades[ca];
    } else {
      // Decrement tokens and update position/sol_buy accordingly
      tradeForMint.tokens -= Math.floor(tokenAmount);

      // Make sure tokens don't become negative
      if (tradeForMint.tokens <= 0) {
        // Remove the mint from the user's trades entirely
        delete userTrades[ca];
      } else {
        // Optionally update sol_buy and position by subtracting solOut if you track these on sells
        // Example: Assuming you have solOut to subtract
        tradeForMint.sol_buy = (
          parseFloat(tradeForMint.sol_buy) - parseFloat(newQuote.outAmount)
        ).toString();
        tradeForMint.position = (
          parseFloat(tradeForMint.position) - parseFloat(newQuote.outAmount)
        ).toString();
      }

      // If userTrades now has no keys, you can also delete the entire recipient entry:
      if (Object.keys(userTrades).length === 0) {
        tradesCacheMap.delete(recipient);
      } else {
        tradesCacheMap.set(recipient, userTrades);
      }
    }

    const remainingTrades = Object.values(userTrades).flat();
    return res.json({ txResult, remainingTrades });
  } catch (err) {
    console.error(err);
  }
});

export default koltraderDEXSellRouter;
