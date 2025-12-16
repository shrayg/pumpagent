import { solConnectionExtra, solConnection } from "../utils/constants.js";
import { PublicKey } from "@solana/web3.js";
import { events, TradeEventLayout } from "../../websocket/utils/constants.js";

const ca = "8DmbSmNZZuRTKJvjAty9g1Wewc3RZqn99Z7HBwfUpump";

try {
  const confirmedSignatures =
    await solConnectionExtra().getSignaturesForAddress(new PublicKey(ca), {
      limit: 1000,
    });

  const oldestSignature = confirmedSignatures[confirmedSignatures.length - 1];
  const oldestSlot = oldestSignature.slot;
  const block = await solConnection().getBlock(oldestSlot, {
    maxSupportedTransactionVersion: 0,
  });

  const extractedData = block.transactions
    .filter((tx) => tx.meta?.err === null) // keep only successful transactions
    .map((tx) => ({
      computeUnitsConsumed: tx.meta?.computeUnitsConsumed,
      fee: tx.meta?.fee,
      status: tx.meta?.status,
      err: tx.meta?.err,
      logMessages: tx.meta?.logMessages || [],
      signatures: tx.transaction.signatures,
    }));

  //   console.log(extractedData); // Number of successful txs

  //   console.log("Filtered Buy/Sell Instructions:");
  //   console.log(JSON.stringify(buySellTxs, null, 2));
  const uniqueBuyers = new Set();
  // 🔁 Your logLine decoding loop for matched txs:
  for (const tx of extractedData) {
    for (const logLine of tx.logMessages) {
      // if (!logLine.startsWith("Program data: ")) continue;

      const base64String = logLine.slice("Program data: ".length);
      const buffer = Buffer.from(base64String, "base64");

      const prefix = buffer.slice(0, 8);

      const matchedEvent = events.find((event) =>
        Buffer.from(event.discriminator).equals(prefix)
      );
      if (!matchedEvent) continue;

      const dataBuffer = buffer.slice(8);
      const data = TradeEventLayout.decode(dataBuffer);
      //   console.log(data);
      const creator = data.creator.toBase58();
      const mint = data.mint.toBase58();
      const user = data.user.toBase58();
      //   console.log("Creator: ", creator);
      if (mint === ca) {
        console.log("MATCH: ", data);
        console.log("Match buy: ", Number(data.sol_amount / 1e9));
        console.log("Creator :", creator);
        uniqueBuyers.add(user);
      }
    }
  }
  console.log("Unique wallets that bought in first block:", uniqueBuyers.size);
  console.log([...uniqueBuyers]); // optional: print them
} catch (err) {
  console.error(err);
}
