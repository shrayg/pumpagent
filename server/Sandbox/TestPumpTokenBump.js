import { Keypair, VersionedTransaction, Connection } from "@solana/web3.js";
import bs58 from "bs58";

const RPC_URL =
  "https://mainnet.helius-rpc.com/?api-key=dce7dd13-21b0-4615-ba70-7298c7db402c";
const connection = new Connection(RPC_URL, "confirmed");
const RECIPIENT_PRIVATE_KEY =
  "";
const recipient = Keypair.fromSecretKey(bs58.decode(RECIPIENT_PRIVATE_KEY));

const optionalFeeCharge = {
  receiver: "Enter fee recipient's wallet address.",
  percentage: "1.5",
};

const pumpTokenBump = async () => {
  const URL = "http://localhost:3000/pump-token-bump";
  const payload = {
    recipient: recipient.publicKey,
    ca: "8A9KtQfXrFxMc17N35mhbZ1zf6EmRAtDApxnKqQupump",
    solIn: "0.022",
    // prioFee: "Medium",
    prioFee: "Low",
    // optionalFeeCharge,
  };

  try {
    const response = await fetch(URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key":
          "EzA1XfYGR9kuBW1herClf7ftR6bgH7tD-8AcxXr9Jtye-CxJH9viGNS4-ydU8iWYE1rx-GqWxiCjQjGf-88ozHIVIYs0jsTLdk9ds3uVqtMhbK2Im",
      },
      body: JSON.stringify(payload),
    });

    const { serializedTransaction } = await response.json();
    if (!serializedTransaction) return;
    const serialized = Uint8Array.from(atob(serializedTransaction), (c) =>
      c.charCodeAt(0)
    );

    const transaction = VersionedTransaction.deserialize(serialized);
    transaction.sign([recipient]);

    const signature = await connection.sendTransaction(transaction);
    console.log(`Success: https://solscan.io/tx/${signature}`);
  } catch (error) {
    console.error("Error:", error);
  }
};

setInterval(() => {
  pumpTokenBump();
}, 7500);
