import {
  Connection,
  Keypair,
  LAMPORTS_PER_SOL,
  clusterApiUrl,
} from "@solana/web3.js";
import bs58 from "bs58";

// Create a connection to the devnet
const connection = new Connection(clusterApiUrl("devnet"), "confirmed");

// Generate or provide your wallet
const PRIV = "";
const wallet = Keypair.fromSecretKey(bs58.decode(PRIV)); // or use existing Keypair

const { blockhash } = await connection.getLatestBlockhash("finalized");
console.log("Blockhash before airdrop: ", blockhash);

// Airdrop 1 SOL (1 SOL = 1_000_000_000 lamports)
const airdropSol = async () => {
  console.log("Requesting airdrop for", wallet.publicKey.toBase58());

  const signature = await connection.requestAirdrop(
    wallet.publicKey,
    LAMPORTS_PER_SOL / 10 // 1 SOL
  );

  //   await connection.confirmTransaction(signature, 'confirmed');

  //   const balance = await connection.getBalance(wallet.publicKey);
  //   console.log(`Balance: ${balance / LAMPORTS_PER_SOL} SOL`);
};

airdropSol();
