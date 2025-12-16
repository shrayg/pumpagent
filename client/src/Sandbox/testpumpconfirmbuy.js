import { Keypair, PublicKey, VersionedTransaction } from "@solana/web3.js";
import bs58 from "bs58";

const priv =
  "2u6TKJJAGrXW1jNCVt8rVCC3mxFYacFayYEsY29dHNsnWZgKESpuw8bYPcoPrVLwBQ97xkciSCzXfCnhaB55AmSU";
const apiKey =
  "EzA1XfYGR9kuBW1herClf7ftR6bgH7tD-8AcxXr9Jtye-CxJH9viGNS4-ydU8iWYE1rx-GqWxiCjQjGf-88ozHIVIYs0jsTLdk9ds3uVqtMhbK2Im";

const ca = "HRaVkdsJdNn94EJ6s8qecArJvRRkEKUY47Eyq4dgpump";
const developerPublickey = "EjKZx46VMAX2vC1vRPkVY6PHHxWubc2oXGgcLsGtE5Tj";

const handleBuy = async () => {
  const buyAmount = "0.0001";
  console.log("Buy amount: ", buyAmount);
  const recipientKeypair = Keypair.fromSecretKey(bs58.decode(priv));
  const recipientPublickey = recipientKeypair.publicKey.toBase58();
  try {
    // Create transaction
    const createRequest = await fetch(
      "http://localhost:3000/create-pumpfun-buy-transaction",
      {
        method: "POST",
        body: JSON.stringify({
          ca,
          solIn: buyAmount,
          recipient: recipientPublickey,
          prioFee: "Medium",
          slippapge: 15,
          creator: developerPublickey,
          jitoTip: "0.00002",
        }),
        headers: {
          "Content-Type": "application/json",
          "x-api-key": apiKey,
        },
      }
    );
    const { serializedTransaction, txResult } = await createRequest.json();
    const transaction = VersionedTransaction.deserialize(
      Uint8Array.from(atob(serializedTransaction), (c) => c.charCodeAt(0))
    );
    console.log("Response");
    transaction.sign([recipientKeypair]);

    const signedTxBase64 = btoa(
      String.fromCharCode(...transaction.serialize())
    );
    console.log("Sending for confirmation");
    const confirmRequest = await fetch(
      "http://localhost:3000/confirm-transaction",
      {
        method: "POST",
        body: JSON.stringify({
          transaction: signedTxBase64,
        }),
        headers: {
          "Content-Type": "application/json",
          "x-api-key": apiKey,
        },
      }
    );
    const { success } = await confirmRequest.json();
    console.log("Buy success: ", success);
    console.log("Tx result: ", txResult);
  } catch (err) {
    console.error(err);
  }
};

handleBuy();
