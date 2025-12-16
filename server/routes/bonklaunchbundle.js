import express from "express";
import anchor from "@coral-xyz/anchor";
import {
  BONK_PLATFROM_ID,
  heliusConnection,
  solConnection,
} from "../utils/constants.js";
import BN from "bn.js";
import bs58 from "bs58";
import {
  PUMP_FUN_PROGRAM,
  TOKEN_PROGRAM_ID,
  ASSOC_TOKEN_ACC_PROG,
  MPL_TOKEN_METADATA,
  MINT_AUTHORITY,
  PUMP_FUN_ACCOUNT,
  GLOBAL,
  FEE_RECIPIENT,
  WSOL,
} from "../utils/constants.js";

import {
  Keypair,
  PublicKey,
  SystemProgram,
  SYSVAR_RENT_PUBKEY,
  LAMPORTS_PER_SOL,
  TransactionMessage,
  VersionedTransaction,
} from "@solana/web3.js";
import {
  getATAAddress,
  buyExactInInstruction,
  getPdaLaunchpadAuth,
  getPdaLaunchpadConfigId,
  getPdaLaunchpadPoolId,
  getPdaLaunchpadVaultId,
  LAUNCHPAD_PROGRAM,
  LaunchpadConfig,
  Raydium,
  TxVersion,
} from "@raydium-io/raydium-sdk-v2";
import {
  createAssociatedTokenAccountIdempotentInstruction,
  getAssociatedTokenAddressSync,
  getAssociatedTokenAddress,
  createSyncNativeInstruction,
  NATIVE_MINT,
} from "@solana/spl-token";
import { chunkArray, getRandomTipAccount } from "../utils/helpers.js";
import { requestTracker } from "../utils/requests.js";
const bonkLaunchBundleRouter = express.Router();

let raydium;

const sdk = async (creator) => {
  // Load the Raydium SDK
  raydium = await Raydium.load({
    owner: creator,
    connection: heliusConnection(),
    cluster: "mainnet",
    disableFeatureCheck: true,
    disableLoadToken: false,
    blockhashCommitment: "confirmed",
  });

  return raydium;
};

const getPoolInfo = async (mint) => {
  const [poolPda] = PublicKey.findProgramAddressSync(
    [Buffer.from("pool"), mint.toBuffer()],
    new PublicKey("BFUNm9sH9RP3iKxwbJXVQjvTqDxj8YpvngCBvqxoWZRz")
  );

  const accountInfo = await this.connection.getAccountInfo(poolPda);
  if (!accountInfo) throw new Error("Pool not found");

  const data = accountInfo.data;
  return {
    address: poolPda,
    virtualSolReserves: new BN(data.slice(8, 16), "le"),
    virtualTokenReserves: new BN(data.slice(16, 24), "le"),
    realSolReserves: new BN(data.slice(24, 32), "le"),
    realTokenReserves: new BN(data.slice(32, 40), "le"),
  };
};

const createBonkTokenTx = async (
  creator,
  devBuy,
  mintKp,
  name,
  symbol,
  uri,
  lookupTableAccount,
  jitoTip,
  funderKey,
  PLATFORM_FEE
) => {
  try {
    // Initialize SDK
    const raydium = await sdk(creator);
    // Get config info
    const configId = getPdaLaunchpadConfigId(
      LAUNCHPAD_PROGRAM,
      WSOL,
      0,
      0
    ).publicKey;
    const configData = await heliusConnection().getAccountInfo(configId);

    if (!configData) {
      throw new Error("Config not found");
    }

    const configInfo = LaunchpadConfig.decode(configData.data);
    const mintBInfo = await raydium.token.getTokenInfo(configInfo.mintB);

    // Set up transaction parameters
    const buyAmount = new BN(devBuy * 10 ** 9);
    const slippage = new BN(0.1 * 100);

    // Create launchpad transaction
    const { transactions } = await raydium.launchpad.createLaunchpad({
      programId: LAUNCHPAD_PROGRAM,
      mintA: mintKp.publicKey,
      decimals: 6,
      name,
      symbol,
      migrateType: "amm",
      uri,
      configId,
      configInfo,
      mintBDecimals: mintBInfo.decimals,
      slippage,
      platformId: new PublicKey("FfYek5vEz23cMkWsdJwG2oa6EphsvXSHrGpdALN4g6W1"),
      txVersion: TxVersion.LEGACY,
      buyAmount,
      feePayer: creator,
      createOnly: buyAmount === 0 ? true : false,
      extraSigners: [mintKp],
      computeBudgetConfig: {
        units: 1_200_000,
        microLamports: 100_000,
      },
    });

    const { blockhash } = await heliusConnection().getLatestBlockhash(
      "finalized"
    );

    const ixs = transactions[0].instructions;

    ixs.push(
      SystemProgram.transfer({
        fromPubkey: funderKey,
        toPubkey: getRandomTipAccount(),
        lamports: Math.floor(jitoTip * LAMPORTS_PER_SOL),
      })
    );

    const feeInstruction = SystemProgram.transfer({
      fromPubkey: funderKey,
      toPubkey: new PublicKey(process.env.FEE_WALLET),
      lamports: BigInt(PLATFORM_FEE * LAMPORTS_PER_SOL), // Base fee of 0.1 SOL
    });
    ixs.push(feeInstruction);

    const ata = getAssociatedTokenAddressSync(mintKp.publicKey, creator);
    const ATAinstruction = createAssociatedTokenAccountIdempotentInstruction(
      creator,
      ata,
      creator,
      mintKp.publicKey,
      TOKEN_PROGRAM_ID,
      ASSOC_TOKEN_ACC_PROG
    );
    if (buyAmount > 0) ixs.push(ATAinstruction);

    const messageV0 = new TransactionMessage({
      payerKey: creator,
      recentBlockhash: blockhash,
      instructions: ixs,
    }).compileToV0Message([lookupTableAccount]);

    const transaction = new VersionedTransaction(messageV0);
    transaction.sign([mintKp]);
    return Buffer.from(transaction.serialize()).toString("base64");
  } catch (error) {
    console.error("createTokenTx error:", error);
    throw error;
  }
};

const calculateCurveTokenAmount = (solInput, context) => {
  const solAmount = solInput * LAMPORTS_PER_SOL;
  const e = new BN(solAmount);
  const initialVirtualSolReserves =
    30 * LAMPORTS_PER_SOL + context.initialRealSolReserves;

  const a = new BN(initialVirtualSolReserves).mul(
    new BN(context.initialVirtualTokenReserves)
  );
  const i = new BN(initialVirtualSolReserves).add(e);
  const l = a.div(i).add(new BN(1));
  let tokensToBuy = new BN(context.initialVirtualTokenReserves).sub(l);
  tokensToBuy = BN.min(tokensToBuy, new BN(context.initialRealTokenReserves));

  const tokensBought = tokensToBuy.toNumber();

  context.initialRealSolReserves += e.toNumber();
  context.initialRealTokenReserves -= tokensBought;
  context.initialVirtualTokenReserves -= tokensBought;

  return tokensBought;
};

const createWalletSwaps = async (
  payer,
  blockhash,
  wallets,
  lookupTableAccount,
  mint,
  curveContext,
  tokensBought
) => {
  console.log("Start of wallet swaps");
  const unsignedTxs = [];
  const chunkedKeypairs = chunkArray(wallets, 5);

  // Iterate over each chunk of keypairs
  for (let chunkIndex = 0; chunkIndex < chunkedKeypairs.length; chunkIndex++) {
    const chunk = chunkedKeypairs[chunkIndex];
    const instructionsForChunk = [];

    // Iterate over each keypair in the chunk to create swap instructions
    for (let i = 0; i < chunk.length; i++) {
      const recipientPublicKey = new PublicKey(chunk[i].publicKey);
      const walletBuyAmount = Number(chunk[i].solBuy);

      // Calculate token amount using curve
      const walletTokenAmount = new BN(
        calculateCurveTokenAmount(walletBuyAmount, curveContext)
      );
      tokensBought = tokensBought + Number(walletTokenAmount);

      // Get PDAs and config accounts
      const configId = getPdaLaunchpadConfigId(
        LAUNCHPAD_PROGRAM,
        WSOL,
        0,
        0
      ).publicKey;

      const poolId = getPdaLaunchpadPoolId(
        LAUNCHPAD_PROGRAM,
        mint.publicKey,
        WSOL
      ).publicKey;

      const authProgramId = getPdaLaunchpadAuth(LAUNCHPAD_PROGRAM).publicKey;

      // Get Associated Token Addresses
      const tokenAta = await getAssociatedTokenAddress(
        mint.publicKey,
        recipientPublicKey
      );

      const wsolAta = await getAssociatedTokenAddress(WSOL, recipientPublicKey);

      // Get vaults - Fixed: vaultA for base token (NLP), vaultB for quote token (WSOL)
      const vaultA = getPdaLaunchpadVaultId(
        LAUNCHPAD_PROGRAM,
        poolId,
        mint.publicKey // Base token vault (NLP)
      ).publicKey;

      const vaultB = getPdaLaunchpadVaultId(
        LAUNCHPAD_PROGRAM,
        poolId,
        WSOL // Quote token vault (WSOL)
      ).publicKey;

      // Create Associated Token Accounts if needed
      instructionsForChunk.push(
        createAssociatedTokenAccountIdempotentInstruction(
          recipientPublicKey,
          tokenAta,
          recipientPublicKey,
          mint.publicKey
        ),
        createAssociatedTokenAccountIdempotentInstruction(
          recipientPublicKey,
          wsolAta,
          recipientPublicKey,
          WSOL
        )
      );

      // Transfer SOL to WSOL ATA and sync native
      const solTransferAmount = Math.floor(walletBuyAmount * LAMPORTS_PER_SOL);
      instructionsForChunk.push(
        SystemProgram.transfer({
          fromPubkey: recipientPublicKey,
          toPubkey: wsolAta,
          lamports: solTransferAmount,
        }),
        createSyncNativeInstruction(wsolAta)
      );

      // Prepare buy instruction parameters - Fixed based on Solscan transaction
      const buyAmountLamports = new BN(solTransferAmount); // Amount of WSOL to spend
      const minTokenAmount = new BN(0); // Minimum NLP tokens to receive (matches transaction)
      const shareFeeRate = new BN(0); // Share fee rate (matches transaction)

      const platformClaimFeeVault = await getAssociatedTokenAddress(
        mint.publicKey,
        BONK_PLATFROM_ID,
        true
      );

      const creatorClaimFeeVault = await getAssociatedTokenAddress(
        mint.publicKey,
        recipientPublicKey,
        true
      );

      // Create the buy instruction
      const instruction = buyExactInInstruction(
        LAUNCHPAD_PROGRAM,
        recipientPublicKey, // payer (signer)
        authProgramId, // authority
        configId, // global config
        BONK_PLATFROM_ID, // platform config
        poolId, // pool state
        tokenAta, // user base token account (for NLP tokens)
        wsolAta, // user quote token account (for WSOL)
        vaultA, // base vault (NLP tokens)
        vaultB, // quote vault (WSOL)
        mint.publicKey, // base token mint (NLP)
        WSOL, // quote token mint (WSOL)
        TOKEN_PROGRAM_ID, // base token program
        TOKEN_PROGRAM_ID, // quote token program
        platformClaimFeeVault, // ✅ REQUIRED
        creatorClaimFeeVault, // ✅ REQUIRED
        buyAmountLamports, // BN
        minTokenAmount, // BN
        shareFeeRate // optional BN
      );

      instructionsForChunk.push(instruction);
    }

    // Create versioned transaction for this chunk
    const message = new TransactionMessage({
      payerKey: payer,
      instructions: instructionsForChunk,
      recentBlockhash: blockhash,
    }).compileToV0Message([lookupTableAccount]);

    const versionedTx = new VersionedTransaction(message);

    // Add serialized transaction to array
    unsignedTxs.push(Buffer.from(versionedTx.serialize()).toString("base64"));
  }

  return { unsignedTxs, tokensBought };
};

bonkLaunchBundleRouter.post("/", async (req, res) => {
  const {
    funderPubKey,
    sanitizedWallets,
    name,
    symbol,
    lut,
    uri,
    vanityPriv = null,
    tip = "0.01",
  } = req.body;
  requestTracker.requestTracker++;

  const createCurveContext = () => ({
    initialRealSolReserves: 0,
    initialVirtualTokenReserves: 1073000000 * 10 ** 6,
    initialRealTokenReserves: 793100000 * 10 ** 6,
  });
  const curveContext = createCurveContext();

  let tokensBought = 0;

  const PLATFORM_FEE =
    req.tier === "Apprentice"
      ? parseFloat(process.env.BUNDLE_LAUNCH_FEE)
      : req.tier === "God"
      ? parseFloat(process.env.GOD_FEE_PERCENTAGE)
      : parseFloat(process.env.ALCHEMIST_BUNDLE_LAUNCH_FEE);

  const funderKey = new PublicKey(funderPubKey);
  const creator = new PublicKey(sanitizedWallets[0].publicKey);

  const mintKeypair = vanityPriv
    ? Keypair.fromSecretKey(bs58.decode(vanityPriv))
    : Keypair.generate();

  const unsigned = [];
  const lookupTable = new PublicKey(lut);

  const lookupTableAccount = (
    await solConnection().getAddressLookupTable(lookupTable)
  ).value;

  if (lookupTableAccount === null)
    throw new Error("Lookup table account not found!");

  // 1. Create bonk token + developer buy
  const devBuy = Number(sanitizedWallets[0].solBuy);
  // Increment curvecontext
  calculateCurveTokenAmount(Number(sanitizedWallets[0].solBuy), curveContext);

  const tokenCreationTx = await createBonkTokenTx(
    creator,
    devBuy,
    mintKeypair,
    name,
    symbol,
    uri,
    lookupTableAccount,
    tip,
    funderKey,
    PLATFORM_FEE
  );
  unsigned.push(tokenCreationTx);

  const { blockhash } = await solConnection().getLatestBlockhash("finalized");

  // 2. Create wallet buys
  const result = await createWalletSwaps(
    funderKey,
    blockhash,
    sanitizedWallets.slice(1),
    lookupTableAccount,
    mintKeypair,
    curveContext,
    tokensBought
  );

  const { unsignedTxs, tokensBought: updatedTokensBought } = result;
  tokensBought = updatedTokensBought;
  unsigned.push(...unsignedTxs);

  res.json({ unsigned, ca: mintKeypair.publicKey.toBase58(), tokensBought });
});

export default bonkLaunchBundleRouter;
