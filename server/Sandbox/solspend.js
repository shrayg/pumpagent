import { PublicKey } from "@solana/web3.js";
import { solConnection } from "../utils/constants.js"; // make sure this returns a valid Connection instance

async function getSolBalanceDifference(txSignature, walletPubkeyStr) {
  const pubkey = new PublicKey(walletPubkeyStr);

  const tx = await solConnection().getTransaction(txSignature, {
    commitment: "confirmed",
    maxSupportedTransactionVersion: 0,
  });

  if (!tx || !tx.meta) {
    throw new Error("Transaction not found or missing metadata");
  }

  const accountKeys = tx.transaction.message.staticAccountKeys;
  const accountIndex = accountKeys.findIndex((key) => key.equals(pubkey));

  if (accountIndex === -1) {
    throw new Error("Wallet not involved in transaction");
  }

  const preLamports = tx.meta.preBalances[accountIndex];
  const postLamports = tx.meta.postBalances[accountIndex];
  const lamportsSpent = preLamports - postLamports;

  return lamportsSpent / 1e9; // SOL
}

// Example usage:
const result = await getSolBalanceDifference(
  "RNPUj1urwz11sJGQp4znq3FKB5BsnHqpuzXPu2BabRjCR6WFyNpNuzbRtk3KPmoBjL6m9qkFzhfi7j3CxrAoXhc",
  "otBNE6HbfEyMBpBoLEsZ5V3CcTim3DMS5mpjD66z6cc"
);
console.log("Net SOL change:", result, "SOL");
