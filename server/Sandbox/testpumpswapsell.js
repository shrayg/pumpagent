import { Keypair, VersionedTransaction } from "@solana/web3.js";
import bs58 from "bs58";
import { heliusConnection, solConnection } from "../utils/constants.js";

const RECIPIENT_PRIVATE_KEY = "";
const recipient = Keypair.fromSecretKey(bs58.decode(RECIPIENT_PRIVATE_KEY));

const pumpSwapSell = async () => {
  const URL = "http://localhost:3000/dex-single-sell";
  const payload = {
    recipient: recipient.publicKey,
    ca: "65QwxNtbekrrFuZrQtUCNHqSnrjderAoiNENwGijpump",
    tokenAmount: "2000",
    prioFee: "Medium",
    slippage: "10",
  };

  try {
    const request = await fetch(URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key":
          "EzA1XfYGR9kuBW1herClf7ftR6bgH7tD-8AcxXr9Jtye-CxJH9viGNS4-ydU8iWYE1rx-GqWxiCjQjGf-88ozHIVIYs0jsTLdk9ds3uVqtMhbK2Im",
      },
      body: JSON.stringify(payload),
    });
    const { serializedTransaction } = await request.json();
    console.log(serializedTransaction);
    if (!serializedTransaction) return;
    const serialized = Uint8Array.from(
      Buffer.from(serializedTransaction, "base64")
    );

    const transaction = VersionedTransaction.deserialize(serialized);
    transaction.sign([recipient]);

    const signature = await solConnection().sendTransaction(transaction);
    console.log(`Success: https://solscan.io/tx/${signature}`);
  } catch (error) {
    console.error("Error:", error);
  }
};

pumpSwapSell();
