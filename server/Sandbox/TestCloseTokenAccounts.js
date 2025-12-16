// Solana Web3
import {
  Connection,
  Keypair,
  PublicKey,
  clusterApiUrl,
  Transaction,
} from "@solana/web3.js";

// SPL Token utilities
import {
  TOKEN_PROGRAM_ID,
  getAccount,
  getAssociatedTokenAddress,
  closeAccount,
  AccountLayout,
  createBurnInstruction,
  createCloseAccountInstruction,
  getMint,
} from "@solana/spl-token";

import bs58 from "bs58";
import { heliusConnection, solConnection } from "../utils/constants.js";

// Replace with your private key
const PRIVATE_KEY_BASE58 = "";

const wallet = Keypair.fromSecretKey(bs58.decode(PRIVATE_KEY_BASE58));
console.log(wallet.publicKey.toBase58());

// const connection = heliusConnection();
const connection = new Connection(
  "https://mainnet.helius-rpc.com/?api-key=767f42d9-06c2-46f8-8031-9869035d6ce4",
  "confirmed"
);

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

const MAX_INSTRUCTIONS_PER_TX = 12; // Rough estimate (usually 10 or fewer fits)

async function closeAccounts(walletPubkey, selectedTokens) {
  const chunks = [];
  for (let i = 0; i < selectedTokens.length; i += MAX_INSTRUCTIONS_PER_TX) {
    chunks.push(selectedTokens.slice(i, i + MAX_INSTRUCTIONS_PER_TX));
  }
  for (const chunk of chunks) {
    const latestBlockhash = await connection.getLatestBlockhash();
    const transaction = new Transaction({ ...latestBlockhash });

    for (const token of chunk) {
      const tokenMint = new PublicKey(token.mint);
      const tokenAccount = new PublicKey(token.account);

      const mintInfo = await getMint(connection, tokenMint);
      const decimals = mintInfo.decimals;

      const tokenAccInfo = await getAccount(connection, tokenAccount);
      const amount = Number(tokenAccInfo.amount); // raw amount, not uiAmount

      // Burn if any amount > 0
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

      // Only close if balance is zero or being burned in same txn
      const closeIx = createCloseAccountInstruction(
        tokenAccount,
        walletPubkey,
        walletPubkey,
        [],
        TOKEN_PROGRAM_ID
      );
      transaction.add(closeIx);
    }

    const signature = await connection.sendTransaction(transaction, [wallet]);
    console.log("Chunk sent:", signature);
    await connection.confirmTransaction(signature, "confirmed");
    console.log("Chunk confirmed.");
  }
}
// --- Run Script ---
(async () => {
  const walletPubkeyStr = wallet.publicKey.toBase58();
  console.log(walletPubkeyStr);
  const tokens = await getTokenAccounts(walletPubkeyStr);

  console.log("Found tokens:", tokens);

  await closeAccounts(wallet.publicKey, tokens);
})();
