import { Keypair } from "@solana/web3.js";
import bs58 from "bs58";

// Generate a new Solana keypair
const keypair = Keypair.generate();

// Convert the secret key to base58
const privateKeyBs58 = bs58.encode(keypair.secretKey);

// Output the keys
console.log("Public Key:", keypair.publicKey.toBase58());
console.log("Private Key (bs58):", privateKeyBs58);
