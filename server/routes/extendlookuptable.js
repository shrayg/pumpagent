import express from "express";
import {
  Program,
  AnchorProvider,
  setProvider,
  Wallet,
} from "@coral-xyz/anchor";
import anchor from "@coral-xyz/anchor";
import IDL from "../utils/pumpfun-IDL.json" with { type: "json" };
import {
  AddressLookupTableProgram,
  PublicKey,
  SystemProgram,
  TransactionMessage,
  VersionedTransaction,
  LAMPORTS_PER_SOL,
  ComputeBudgetProgram,
  Keypair,
  SYSVAR_RENT_PUBKEY,
} from "@solana/web3.js";
import {
  ASSOC_TOKEN_ACC_PROG,
  BONK_PLATFROM_ID,
  heliusConnection,
  WSOL,
  TOKEN_PROGRAM_ID,
  solConnection,
  FEE_RECIPIENT,
  PUMP_FUN_ACCOUNT,
  PUMP_FUN_PROGRAM,
} from "../utils/constants.js";
import { requestTracker } from "../utils/requests.js";
import bs58 from "bs58";
import { getPriorityFeeEstimate, globalVolumeAccumulatorPda, userVolumeAccumulatorPda } from "../utils/helpers.js";
import {
  ASSOCIATED_TOKEN_PROGRAM_ID,
  getAssociatedTokenAddress,
  getAssociatedTokenAddressSync,
  NATIVE_MINT,
} from "@solana/spl-token";
import {
  getATAAddress,
  getPdaLaunchpadAuth,
  getPdaLaunchpadConfigId,
  getPdaLaunchpadPoolId,
  getPdaLaunchpadVaultId,
  LAUNCHPAD_PROGRAM,
} from "@raydium-io/raydium-sdk-v2";

const extendLookupTableRouter = express.Router();

extendLookupTableRouter.post("/", async (req, res) => {
  requestTracker.totalRequests++;
  try {
    const { creator, wallets, lut, prioFee = null, mint, platform } = req.body;

    if (!creator || !wallets || !lut || !Array.isArray(wallets)) {
      return res.status(400).json({ error: "Missing or invalid fields" });
    }
    const PUMP_PROGRAM = new PublicKey(
      "6EF8rrecthR5Dkzon8Nwu78hRvfCKubJ14M5uBEwF6P"
    );
    const signerPublicKey = new PublicKey(creator);

    const PLATFORM_FEE =
      req.tier === "Apprentice"
        ? parseFloat(process.env.EXTEND_LUT_FEE)
        : req.tier === "God"
        ? parseFloat(process.env.GOD_FEE_PERCENTAGE)
        : parseFloat(process.env.ALCHEMIST_EXTEND_LUT_FEE);

    const provider = new anchor.AnchorProvider(
      solConnection(),
      new anchor.Wallet(Keypair.generate()),
      { commitment: "confirmed" }
    );

    setProvider(provider);
    const program = new anchor.Program(IDL, provider);

    let publicKeyWallets = wallets.map((wallet) => new PublicKey(wallet));
    if (platform === "Bonk") {
      // Add common program IDs
      publicKeyWallets.push(WSOL, TOKEN_PROGRAM_ID, ASSOC_TOKEN_ACC_PROG);
      wallets.forEach((wallet) => {
        const recipientPublicKey = new PublicKey(wallet);
        const userTokenAccountA = getAssociatedTokenAddressSync(
          new PublicKey(mint),
          recipientPublicKey
        );
        const userTokenAccountB = getAssociatedTokenAddressSync(
          WSOL,
          recipientPublicKey
        );
        publicKeyWallets.push(userTokenAccountA, userTokenAccountB);
      });

      // If mint specified, add associated token accounts for mint and WSOL

      // Special case if mint ends with 'bonk'
      const platformId = new PublicKey(
        "4Bu96XjU84XjPDSpveTVf6LYGCkfW5FK7SNkREWcEfV4"
      );
      const poolId = getPdaLaunchpadPoolId(
        LAUNCHPAD_PROGRAM,
        new PublicKey(mint),
        WSOL
      ).publicKey;
      const vaultA = getPdaLaunchpadVaultId(
        LAUNCHPAD_PROGRAM,
        poolId,
        new PublicKey(mint)
      ).publicKey;
      const vaultB = getPdaLaunchpadVaultId(
        LAUNCHPAD_PROGRAM,
        poolId,
        WSOL
      ).publicKey;

      publicKeyWallets.push(
        configId,
        platformId,
        poolId,
        vaultA,
        vaultB,
        authProgramId
      );

      // Add launchpad auth and bonk platform IDs
      const authProgramId = getPdaLaunchpadAuth(LAUNCHPAD_PROGRAM).publicKey;
      publicKeyWallets.push(authProgramId, BONK_PLATFROM_ID);

      // Add config ID for WSOL
      const configId = getPdaLaunchpadConfigId(
        LAUNCHPAD_PROGRAM,
        WSOL,
        0,
        0
      ).publicKey;
      publicKeyWallets.push(configId);

      // Add each wallet's ATA for WSOL
      wallets.forEach((wallet) => {
        const recipientPublicKey = new PublicKey(wallet);
        const ataAddress = getATAAddress(recipientPublicKey, WSOL).publicKey;
        publicKeyWallets.push(ataAddress);
      });
    }

    if (platform === "Pump") {
      let updatedWallets = [];

      const [coinCreatorVaultAuthority] = PublicKey.findProgramAddressSync(
        [Buffer.from("creator-vault"), new PublicKey(wallets[0]).toBuffer()],
        PUMP_FUN_PROGRAM
      );

      for (const pubkey of publicKeyWallets) {
        const pk = new PublicKey(pubkey);
        if (PublicKey.isOnCurve(pk.toBytes())) {
          updatedWallets.push(pk);

          const ataToken = getAssociatedTokenAddressSync(
            new PublicKey(mint),
            pk
          );
          if (PublicKey.isOnCurve(ataToken.toBytes())) {
            updatedWallets.push(ataToken);
          }
        }
      }

      const MPL_TOKEN_METADATA_PROGRAM_ID = new PublicKey(
        "metaqbxxUerdq28cj1RbAWkYQm3ybzjb6a8bt518x1s"
      );

      const global = new PublicKey(
        "4wTV1YmiEkRvAtNtsSGPtUrqRYQMe5SKy2uB4Jjaxnjf"
      );

      const [bondingCurve] = PublicKey.findProgramAddressSync(
        [Buffer.from("bonding-curve"), new PublicKey(mint).toBytes()],
        program.programId
      );

      const [metadata] = PublicKey.findProgramAddressSync(
        [
          Buffer.from("metadata"),
          MPL_TOKEN_METADATA_PROGRAM_ID.toBytes(),
          new PublicKey(mint).toBytes(),
        ],
        MPL_TOKEN_METADATA_PROGRAM_ID
      );

      const [associatedBondingCurve] = PublicKey.findProgramAddressSync(
        [
          bondingCurve.toBytes(),
          TOKEN_PROGRAM_ID.toBytes(),
          new PublicKey(mint).toBytes(),
        ],
        ASSOCIATED_TOKEN_PROGRAM_ID
      );

      const eventAuthority = new PublicKey(
        "Ce6TQqeHC9p8KetsN6JsjHK7UTZk7nasjjnr7XxXp9F1"
      );
      const feeRecipient = new PublicKey(
        "CebN5WGQ4jvEPvsVU4EoHEpgzq1VV7AbicfhtW4xC9iM"
      );

      const globalAcc = globalVolumeAccumulatorPda();
      const globalVol = userVolumeAccumulatorPda(FEE_RECIPIENT)

      const extraAccounts = [
        ASSOCIATED_TOKEN_PROGRAM_ID,
        TOKEN_PROGRAM_ID,
        PUMP_FUN_ACCOUNT,
        MPL_TOKEN_METADATA_PROGRAM_ID,
        coinCreatorVaultAuthority,
        global,
        program.programId,
        metadata,
        associatedBondingCurve,
        bondingCurve,
        eventAuthority,
        SystemProgram.programId,
        SYSVAR_RENT_PUBKEY,
        new PublicKey(mint),
        feeRecipient,
        signerPublicKey,
        globalAcc,
        globalVol
      ];

      for (const acc of extraAccounts) {
        if (PublicKey.isOnCurve(acc)) {
          updatedWallets.push(acc);
        }
      }

      publicKeyWallets = [...new Set(updatedWallets)];
    }

    // Create extend lookup table instruction
    const addAddressesInstruction = AddressLookupTableProgram.extendLookupTable(
      {
        lookupTable: new PublicKey(lut),
        authority: signerPublicKey,
        payer: signerPublicKey,
        addresses: publicKeyWallets,
      }
    );

    // Fee transfer instruction
    const feeInstruction = SystemProgram.transfer({
      fromPubkey: signerPublicKey,
      toPubkey: new PublicKey(process.env.FEE_WALLET),
      lamports: BigInt(Math.floor(PLATFORM_FEE * LAMPORTS_PER_SOL)),
    });

    // Fetch latest blockhash
    const { blockhash } = await heliusConnection().getLatestBlockhash(
      "finalized"
    );
    const wantsPrio = ["Low", "Medium", "High", "VeryHigh"].includes(prioFee);

    // Create transaction message v0
    const messageV0 = new TransactionMessage({
      payerKey: signerPublicKey,
      recentBlockhash: blockhash,
      instructions: [addAddressesInstruction, feeInstruction],
    }).compileToV0Message();

    const tx = new VersionedTransaction(messageV0);
    const serializedTransaction = Buffer.from(tx.serialize()).toString(
      "base64"
    );
    


    if (!wantsPrio) {
      return res.json({ serializedTransaction });
    }

    // Add priority fee instruction if requested
    const prioIx = ComputeBudgetProgram.setComputeUnitPrice({
      microLamports: await getPriorityFeeEstimate(
        bs58.encode(tx.serialize()),
        prioFee
      ),
    });

    const updatedInstructions = [
      prioIx,
      addAddressesInstruction,
      feeInstruction,
    ];

    const { blockhash: newHash } = await heliusConnection().getLatestBlockhash(
      "finalized"
    );

    const message = new TransactionMessage({
      payerKey: signerPublicKey,
      recentBlockhash: newHash,
      instructions: updatedInstructions,
    }).compileToV0Message();

    const prioTx = new VersionedTransaction(message);
    const serialized = Buffer.from(prioTx.serialize()).toString("base64");
    console.log("Tx Length: ", prioTx.serialize().length)
    return res.json({ serializedTransaction: serialized });
  } catch (error) {
    console.error("Error in /extend-lut:", error);
    return res.status(500).json({ error: "Failed to extend lookup table" });
  }
});

export default extendLookupTableRouter;
