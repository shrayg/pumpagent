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
import bs58 from "bs58";
import { tradesCacheMap } from "../utils/tradescache.js";
import { heliusConnection, solConnection } from "../utils/constants.js";
import {
  getRandomTipAccount,
  sendJitoTransaction,
  waitForFinalizedTransaction,
} from "../utils/helpers.js";

const koltraderDEXBuyRouter = express.Router();

koltraderDEXBuyRouter.post("/", async (req, res) => {
  const {
    recipient,
    ca,
    solIn,
    slippage,
    prioFee,
    target = null,
    coinData,
    jitoTip,
  } = req.body;

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
    const amount = Number(solIn) * LAMPORTS_PER_SOL;
    const finalSlippage = slippage ? Number(slippage) * 100 : 0;

    const newQuote = await (
      await fetch(
        `https://lite-api.jup.ag/swap/v1/quote?inputMint=So11111111111111111111111111111111111111112&outputMint=${ca}&amount=${amount}&slippageBps=${finalSlippage}&restrictIntermediateTokens=true&platformFeeBps=${PLATFORM_FEE}`
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
          feeAccount: "6WBvMkF6hNSMwvm4QPMSyEgYSYrEV1AoPbM46BKYacjG", // Jup fee account
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
    const tokenAmount = newQuote.outAmount / 1e6;
    const pricePerToken = usdSpend / tokenAmount;
    const marketCap = pricePerToken * 1_000_000_000;

    const txResult = {
      mint: ca,
      name: coinData.name,
      symbol: coinData.symbol,
      image: coinData.image_uri,
      position: solIn,
      tokens: newQuote.outAmount,
      entry: marketCap,
      target,
      pnl: 0,
      timestamp: Date.now(),
      type: "Buy",
      migrated: true,
      marketCap,
      sol_buy: solIn,
      txid: response,
      migrated: true,
    };

    const currentTradesForRecipient = tradesCacheMap.get(recipient) ?? {};
    const existingTrade = currentTradesForRecipient[ca];

    if (!existingTrade) {
      // No trade for this mint yet
      currentTradesForRecipient[ca] = txResult;
    } else {
      // Trade already exists, increment token amount
      existingTrade.tokens = (
        Number(existingTrade.tokens) + Math.floor(newQuote.outAmount)
      ).toString();
      existingTrade.sol_buy = (
        parseFloat(existingTrade.sol_buy) + parseFloat(solIn)
      ).toString();
      existingTrade.position = (
        parseFloat(existingTrade.position) + parseFloat(solIn)
      ).toString();
    }

    tradesCacheMap.set(recipient, currentTradesForRecipient);

    const remainingTrades = Object.values(currentTradesForRecipient).flat();

    return res.json({ txResult, remainingTrades });
  } catch (err) {
    console.error("Buy route error:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
});

export default koltraderDEXBuyRouter;
