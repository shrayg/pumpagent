import express from "express";
import anchor from "@coral-xyz/anchor";
import {
  heliusConnection,
  PUMP_AMM,
  solConnection,
} from "../utils/constants.js";
import IDL from "../utils/pumpfun-IDL.json" with { type: "json" };
import BN from "bn.js";
import {
  PUMP_FUN_PROGRAM,
  TOKEN_PROGRAM_ID,
  ASSOC_TOKEN_ACC_PROG,
  PUMP_FUN_ACCOUNT,
  GLOBAL,
  FEE_RECIPIENT,
} from "../utils/constants.js";
import bs58 from "bs58";
import {
  calculateSellAmountInSol,
  getPriorityFeeEstimate,
  getRandomTipAccount,
  getTokenCurve,
  sendJitoTransaction,
  waitForFinalizedTransaction,
} from "../utils/helpers.js";
import {
  Keypair,
  PublicKey,
  SystemProgram,
  SYSVAR_RENT_PUBKEY,
  TransactionMessage,
  VersionedTransaction,
  LAMPORTS_PER_SOL,
  ComputeBudgetProgram,
} from "@solana/web3.js";
import {
  createAssociatedTokenAccountIdempotentInstruction,
  getAssociatedTokenAddressSync,
} from "@solana/spl-token";
import { requestTracker } from "../utils/requests.js";
import { tradesCacheMap } from "../utils/tradescache.js";
import { tradeWalletsMap } from "../utils/loadtradewallets.js";
import { calculateMarketcap } from "../../client/src/utils/functions.js";

const kolTraderSellRouter = express.Router();

kolTraderSellRouter.post("/", async (req, res) => {
  try {
    requestTracker.requestTracker++;

    const {
      ca,
      recipient,
      tokenAmount,
      prioFee = "High",
      coinData,
      solPrice,
      jitoTip
    } = req.body;

    const apiKey = req.headers["x-api-key"];
    if (!apiKey || typeof apiKey !== "string") {
      return res.status(400).json({ error: "Missing or invalid API key" });
    }

    if (!recipient || !ca || !tokenAmount) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    let recipientPublickey, mintPublickey;
    const traderKeypair = Keypair.fromSecretKey(
      bs58.decode(tradeWalletsMap.get(recipient))
    );
    try {
      recipientPublickey = new PublicKey(recipient);
      mintPublickey = new PublicKey(ca);
    } catch (e) {
      return res.status(400).json({ error: "Invalid public key format" });
    }

    const PLATFORM_FEE =
      req.tier === "Apprentice"
        ? parseFloat(process.env.FEE_PERCENTAGE)
        : req.tier === "God"
        ? parseFloat(process.env.GOD_FEE_PERCENTAGE)
        : parseFloat(process.env.ALCHEMIST_FEE_PERCENTAGE);

    const provider = new anchor.AnchorProvider(
      solConnection(),
      new anchor.Wallet(Keypair.generate()),
      { commitment: "confirmed" }
    );

    const program = new anchor.Program(IDL, provider);
    const instructionsArray = [];

    const curveData = await getTokenCurve(ca, program);
    const virtual_token_reserves = Number(curveData.virtualTokenReserves);
    const virtual_sol_reserves = Number(curveData.virtualSolReserves);

    const ata = getAssociatedTokenAddressSync(
      mintPublickey,
      recipientPublickey
    );

    const ATAinstruction = createAssociatedTokenAccountIdempotentInstruction(
      recipientPublickey,
      ata,
      recipientPublickey,
      mintPublickey,
      TOKEN_PROGRAM_ID,
      ASSOC_TOKEN_ACC_PROG
    );

    const [bondingCurve] = PublicKey.findProgramAddressSync(
      [Buffer.from("bonding-curve"), mintPublickey.toBytes()],
      program.programId
    );

    const [associatedBondingCurve] = PublicKey.findProgramAddressSync(
      [
        bondingCurve.toBuffer(),
        new PublicKey(TOKEN_PROGRAM_ID).toBuffer(),
        mintPublickey.toBuffer(),
      ],
      new PublicKey(ASSOC_TOKEN_ACC_PROG)
    );

    const [bondingCurvePDA] = PublicKey.findProgramAddressSync(
      [Buffer.from("bonding-curve"), mintPublickey.toBuffer()],
      PUMP_FUN_PROGRAM
    );

    const accountInfo = await solConnection().getAccountInfo(bondingCurvePDA);
    if (!accountInfo) {
      return res.status(404).json({ error: "Bonding curve account not found" });
    }

    const tokenCreatorPublicKey = new PublicKey(accountInfo.data.slice(49, 81));

    const [coinCreatorVaultAuthority] = PublicKey.findProgramAddressSync(
      [Buffer.from("creator_vault"), tokenCreatorPublicKey.toBuffer()],
      PUMP_AMM
    );

    const coinCreatorVaultAta = getAssociatedTokenAddressSync(
      mintPublickey,
      coinCreatorVaultAuthority,
      true
    );

    const sellInstruction = await program.methods
      .sell(new BN(Math.floor(tokenAmount)), new BN(0))
      .accounts({
        global: GLOBAL,
        feeRecipient: FEE_RECIPIENT,
        mint: mintPublickey,
        bondingCurve: bondingCurve,
        associatedBondingCurve: associatedBondingCurve,
        associatedUser: ata,
        user: recipientPublickey,
        systemProgram: SystemProgram.programId,
        tokenProgram: TOKEN_PROGRAM_ID,
        rent: SYSVAR_RENT_PUBKEY,
        eventAuthority: PUMP_FUN_ACCOUNT,
        program: PUMP_FUN_PROGRAM,
        creator_vault: coinCreatorVaultAta,
      })
      .instruction();

    instructionsArray.push(ATAinstruction, sellInstruction);

    const sellAmountSol = calculateSellAmountInSol(
      tokenAmount / 1e6,
      virtual_sol_reserves,
      virtual_token_reserves
    );


    const baseFeeLamports = Math.floor(
      (sellAmountSol / 1000) * LAMPORTS_PER_SOL * PLATFORM_FEE
    );

    const feeTransferInstruction = SystemProgram.transfer({
      fromPubkey: recipientPublickey,
      toPubkey: new PublicKey(process.env.FEE_WALLET),
      lamports: BigInt(baseFeeLamports),
    });
    instructionsArray.push(feeTransferInstruction);

    const jitoTipInstruction = SystemProgram.transfer({
      fromPubkey: recipientPublickey,
      toPubkey: getRandomTipAccount(),
      lamports: BigInt(jitoTip),
    });
    instructionsArray.push(jitoTipInstruction);

    const { blockhash } = await heliusConnection().getLatestBlockhash("finalized");

    const messageV0 = new TransactionMessage({
      payerKey: recipientPublickey,
      recentBlockhash: blockhash,
      instructions: instructionsArray,
    }).compileToV0Message();

    const tx = new VersionedTransaction(messageV0);

    const prioIx = ComputeBudgetProgram.setComputeUnitPrice({
      microLamports: !isNaN(prioFee)
        ? Math.floor(prioFee * 1e9)
        : await getPriorityFeeEstimate(bs58.encode(tx.serialize()), prioFee),
    });

    const updatedInstructions = [prioIx, ...instructionsArray];
    const rebuildMessageV0 = new TransactionMessage({
      payerKey: recipientPublickey,
      recentBlockhash: blockhash,
      instructions: updatedInstructions,
    }).compileToV0Message();
    const finalTx = new VersionedTransaction(rebuildMessageV0);


    finalTx.sign([traderKeypair]);

    const bundledTxns = bs58.encode(finalTx.serialize());

    const response = await sendJitoTransaction(bundledTxns);
    if(!response) return res.json({error: "No tokens sold"});

    const txResult = {
      mint: ca,
      name: coinData.name,
      symbol: coinData.symbol,
      image: coinData.image,
      position: sellAmountSol.toString(),
      marketCap: calculateMarketcap(virtual_sol_reserves, virtual_token_reserves, solPrice),
      tokens: tokenAmount,
      exit: coinData.usd_market_cap,
      type: "Sell",
      sol_received: (sellAmountSol / 1000) * 1e9,
      tokens_sold: tokenAmount,
      timestamp: Date.now(),
      txid: response,
    };

    // Handle filtering for sells
    const userTrades = tradesCacheMap.get(recipient) ?? {};
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
          parseFloat(tradeForMint.sol_buy) - parseFloat(sellAmountSol)
        ).toString();
        tradeForMint.position = (
          parseFloat(tradeForMint.position) - parseFloat(sellAmountSol)
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
    console.error("Sell route error:", err);
    return res.status(500).json({
      error: "An unexpected error occurred",
      message: err?.message || "Internal Server Error",
    });
  }
});

export default kolTraderSellRouter;
