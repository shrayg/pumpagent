import WebSocket from "ws";
import { struct, publicKey, i64, str, u64, bool } from "@coral-xyz/borsh";
import { PublicKey } from "@solana/web3.js";

const CompleteEventLayout = struct([
  publicKey("user"),
  publicKey("mint"),
  publicKey("bonding_curve"),
  i64("timestamp"),
]);

const CreateEventLayout = struct([
  str("name"),
  str("symbol"),
  str("uri"),
  publicKey("mint"),
  publicKey("bonding_curve"),
  publicKey("user"),
  publicKey("creator"),
  i64("timestamp"),
  u64("virtual_token_reserves"),
  u64("virtual_sol_reserves"),
  u64("real_token_reserves"),
  u64("token_total_supply"),
]);

// Layout for TradeEvent
const TradeEventLayout = struct([
  publicKey("mint"),
  u64("sol_amount"),
  u64("token_amount"),
  bool("is_buy"),
  publicKey("user"),
  i64("timestamp"),
  u64("virtual_sol_reserves"),
  u64("virtual_token_reserves"),
  u64("real_sol_reserves"),
  u64("real_token_reserves"),
  publicKey("fee_recipient"),
  u64("fee_basis_points"),
  u64("fee"),
  publicKey("creator"),
  u64("creator_fee_basis_points"),
  u64("creator_fee"),
]);

const ws = new WebSocket(
  "wss://mainnet.helius-rpc.com/?api-key=2b7c296b-418b-47d9-b907-87d1ff5affd7"
);

ws.on("open", () => {
  console.log("Connected!");

  const msg = {
    jsonrpc: "2.0",
    id: 1,
    method: "logsSubscribe",
    params: [
      {
        mentions: ["6EF8rrecthR5Dkzon8Nwu78hRvfCKubJ14M5uBEwF6P"],
      },
      {
        commitment: "confirmed",
      },
    ],
  };
  ws.send(JSON.stringify(msg));
});

const events = [
  {
    name: "PoolCreateEvent",
    discriminator: [151, 215, 226, 9, 118, 161, 115, 174],
  },
];

ws.on("message", (data) => {
  const result = JSON.parse(data);
  const logs = result?.params?.result?.value?.logs;
  if (!logs) return;
  console.log(logs);
  for (const logLine of logs) {
    if (logLine.startsWith("Program data: ")) {
      const base64String = logLine.slice("Program data: ".length);
      const buffer = Buffer.from(base64String, "base64");

      const prefix = buffer.slice(0, 8);
      const matchedEvent = events.find((event) => {
        const disc = Buffer.from(event.discriminator);
        return disc.equals(prefix);
      });

      if (matchedEvent) {
        // console.log("Event occurred:", matchedEvent.name);
        const dataBuffer = buffer.slice(8);

        if (matchedEvent.name === "CompleteEvent") {
          const eventData = CompleteEventLayout.decode(dataBuffer);
          console.log({
            user: new PublicKey(eventData.user).toBase58(),
            mint: new PublicKey(eventData.mint).toBase58(),
            bonding_curve: new PublicKey(eventData.bonding_curve).toBase58(),
            timestamp: eventData.timestamp.toNumber(),
          });
        }

        if (matchedEvent.name === "CreateEvent") {
          const eventData = CreateEventLayout.decode(dataBuffer);
          console.log({
            name: eventData.name,
            symbol: eventData.symbol,
            uri: eventData.uri,
            mint: new PublicKey(eventData.mint).toBase58(),
            bonding_curve: new PublicKey(eventData.bonding_curve).toBase58(),
            user: new PublicKey(eventData.user).toBase58(),
            creator: new PublicKey(eventData.creator).toBase58(),
            timestamp: eventData.timestamp.toNumber(),
            virtual_token_reserves: eventData.virtual_token_reserves.toString(),
            virtual_sol_reserves: eventData.virtual_sol_reserves.toString(),
            real_token_reserves: eventData.real_token_reserves.toString(),
            token_total_supply: eventData.token_total_supply.toString(),
          });
        }

        if (matchedEvent.name === "TradeEvent") {
          return;
          const eventData = TradeEventLayout.decode(dataBuffer);
          console.log({
            mint: new PublicKey(eventData.mint).toBase58(),
            sol_amount: eventData.sol_amount.toString(),
            token_amount: eventData.token_amount.toString(),
            is_buy: eventData.is_buy,
            user: new PublicKey(eventData.user).toBase58(),
            timestamp: eventData.timestamp.toNumber(),
            virtual_sol_reserves: eventData.virtual_sol_reserves.toString(),
            virtual_token_reserves: eventData.virtual_token_reserves.toString(),
            real_sol_reserves: eventData.real_sol_reserves.toString(),
            real_token_reserves: eventData.real_token_reserves.toString(),
            fee_recipient: new PublicKey(eventData.fee_recipient).toBase58(),
            fee_basis_points: eventData.fee_basis_points.toString(),
            fee: eventData.fee.toString(),
            creator: new PublicKey(eventData.creator).toBase58(),
            creator_fee_basis_points:
              eventData.creator_fee_basis_points.toString(),
            creator_fee: eventData.creator_fee.toString(),
          });
        }
      }
    }
  }
});
