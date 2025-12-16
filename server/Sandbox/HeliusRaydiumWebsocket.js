import WebSocket from "ws";
import { struct, publicKey, u64, u8 } from "@coral-xyz/borsh";
import { PublicKey } from "@solana/web3.js";

/** TradeEvent Layout */
const TradeEventLayout = struct([
  publicKey("pool_state"),
  u64("total_base_sell"),
  u64("virtual_base"),
  u64("virtual_quote"),
  u64("real_base_before"),
  u64("real_quote_before"),
  u64("real_base_after"),
  u64("real_quote_after"),
  u64("amount_in"),
  u64("amount_out"),
  u64("protocol_fee"),
  u64("platform_fee"),
  u64("share_fee"),
  u8("trade_direction"), // enum
  u8("pool_status"), // enum
]);

/** PoolCreateEvent Layout */
const PoolCreateEventLayout = struct([
  publicKey("pool_state"),
  publicKey("creator"),
  publicKey("config"),
  // MintParams
  publicKey("base_mint_param_mint"),
  u8("base_mint_param_decimals"),
  // CurveParams
  u8("curve_param_curve_type"),
  u64("curve_param_curve_value"),
  // VestingParams
  u64("vesting_param_vesting_start"),
  u64("vesting_param_vesting_end"),
  u64("vesting_param_unlock_percent"),
]);

/** Discriminators from IDL */
const events = [
  {
    name: "TradeEvent",
    discriminator: [189, 219, 127, 211, 78, 230, 97, 238],
  },
  {
    name: "PoolCreateEvent",
    discriminator: [151, 215, 226, 9, 118, 161, 115, 174],
  },
];

const ws = new WebSocket(
  "wss://mainnet.helius-rpc.com/?api-key=2b7c296b-418b-47d9-b907-87d1ff5affd7"
);

ws.on("open", () => {
  console.log("Connected!");
  ws.send(
    JSON.stringify({
      jsonrpc: "2.0",
      id: 1,
      method: "logsSubscribe",
      params: [
        {
          mentions: ["LanMV9sAd7wArD4vJFi2qDdfnVhFxYSUg6eADduJ3uj"], // program ID
        },
        { commitment: "finalized" },
      ],
    })
  );
});

ws.on("message", (data) => {
  const result = JSON.parse(data);
  const logs = result?.params?.result?.value?.logs;
  if (!logs) return;
  console.log(logs);
  for (const logLine of logs) {
    if (logLine.startsWith("Program log: ")) {
      const buffer = Buffer.from(logLine.slice(14), "base64");
      const prefix = buffer.slice(0, 8);

      const matchedEvent = events.find((event) =>
        Buffer.from(event.discriminator).equals(prefix)
      );

      if (matchedEvent) {
        console.log("Event occurred:", matchedEvent.name);
        const dataBuffer = buffer.slice(8);

        if (matchedEvent.name === "TradeEvent") {
          const e = TradeEventLayout.decode(dataBuffer);
          console.log({
            pool_state: new PublicKey(e.pool_state).toBase58(),
            total_base_sell: e.total_base_sell.toString(),
            virtual_base: e.virtual_base.toString(),
            virtual_quote: e.virtual_quote.toString(),
            real_base_before: e.real_base_before.toString(),
            real_quote_before: e.real_quote_before.toString(),
            real_base_after: e.real_base_after.toString(),
            real_quote_after: e.real_quote_after.toString(),
            amount_in: e.amount_in.toString(),
            amount_out: e.amount_out.toString(),
            protocol_fee: e.protocol_fee.toString(),
            platform_fee: e.platform_fee.toString(),
            share_fee: e.share_fee.toString(),
            trade_direction: e.trade_direction,
            pool_status: e.pool_status,
          });
        }

        if (matchedEvent.name === "PoolCreateEvent") {
          const e = PoolCreateEventLayout.decode(dataBuffer);
          console.log({
            pool_state: new PublicKey(e.pool_state).toBase58(),
            creator: new PublicKey(e.creator).toBase58(),
            config: new PublicKey(e.config).toBase58(),
            base_mint: new PublicKey(e.base_mint_param_mint).toBase58(),
            base_mint_decimals: e.base_mint_param_decimals,
            curve_type: e.curve_param_curve_type,
            curve_value: e.curve_param_curve_value.toString(),
            vesting_start: e.vesting_param_vesting_start.toString(),
            vesting_end: e.vesting_param_vesting_end.toString(),
            unlock_percent: e.vesting_param_unlock_percent.toString(),
          });
        }
      }
    }
  }
});
