import express from "express";
import bs58 from "bs58";
import { Connection, PublicKey, Transaction, Keypair } from "@solana/web3.js";
import {
  TOKEN_PROGRAM_ID,
  getAccount,
  getMint,
  createBurnInstruction,
  createCloseAccountInstruction,
} from "@solana/spl-token";
import { heliusConnection } from "../utils/constants.js";
import { requestTracker } from "../utils/requests.js";

const reclaimRentRouter = express.Router();
const connection = heliusConnection();
const MAX_INSTRUCTIONS_PER_TX = 12;

async function getTokenAccounts(walletPubkeyStr) {
  const accounts = await connection.getParsedProgramAccounts(TOKEN_PROGRAM_ID, {
    filters: [
      { dataSize: 165 },
      {
        memcmp: {
          offset: 32,
          bytes: walletPubkeyStr,
        },
      },
    ],
  });

  return accounts.map((account) => ({
    mint: account.account.data.parsed.info.mint,
    amount: account.account.data.parsed.info.tokenAmount.uiAmount,
    account: account.pubkey.toString(),
  }));
}

async function closeAccounts(wallet) {
  const walletPubkey = wallet.publicKey;
  const walletPubkeyStr = walletPubkey.toBase58();
  const tokens = await getTokenAccounts(walletPubkeyStr);

  const chunks = [];
  for (let i = 0; i < tokens.length; i += MAX_INSTRUCTIONS_PER_TX) {
    chunks.push(tokens.slice(i, i + MAX_INSTRUCTIONS_PER_TX));
  }

  const results = [];

  for (const chunk of chunks) {
    const latestBlockhash = await connection.getLatestBlockhash();
    const transaction = new Transaction({ ...latestBlockhash });

    for (const token of chunk) {
      const tokenMint = new PublicKey(token.mint);
      const tokenAccount = new PublicKey(token.account);
      const tokenAccInfo = await getAccount(connection, tokenAccount);
      const amount = Number(tokenAccInfo.amount);

      if (amount > 0) {
        const burnIx = createBurnInstruction(
          tokenAccount,
          tokenMint,
          walletPubkey,
          BigInt(amount),
          [],
          TOKEN_PROGRAM_ID
        );
        transaction.add(burnIx);
      }

      const closeIx = createCloseAccountInstruction(
        tokenAccount,
        walletPubkey,
        walletPubkey,
        [],
        TOKEN_PROGRAM_ID
      );
      transaction.add(closeIx);
    }

    const sig = await connection.sendTransaction(transaction, [wallet]);
    await connection.confirmTransaction(sig, "confirmed");
    results.push(sig);
  }

  return results;
}

reclaimRentRouter.post("/", async (req, res) => {
  requestTracker.totalRequests++;
  const { recipients } = req.body; // wallets: array of base58 strings

  if (!recipients || !Array.isArray(recipients)) {
    return res
      .status(400)
      .json({ error: "Missing or invalid 'wallets' array" });
  }

  try {
    const result = [];

    for (const base58Key of recipients) {
      try {
        const wallet = Keypair.fromSecretKey(bs58.decode(base58Key));
        console.log(
          `Closing accounts for wallet: ${wallet.publicKey.toBase58()}`
        );
        const txs = await closeAccounts(wallet);
        result.push({ wallet: wallet.publicKey.toBase58(), transactions: txs });
      } catch (walletError) {
        console.error("Wallet error:", walletError);
        result.push({
          wallet: "Invalid or failed wallet",
          error: walletError.message || walletError.toString(),
        });
      }
    }

    res.json({ result });
  } catch (error) {
    console.error("Fatal error:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

export default reclaimRentRouter;
