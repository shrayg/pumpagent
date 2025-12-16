import WebSocket from "ws";
import {
  CreatePoolEventLayout,
  SellEventLayout,
  BuyEventLayout,
  pumpSwapEvents,
  pumpSwapLogsMsg,
} from "./utils/constants.js";
import {
  safeParseArray,
  buyEventPayloadBuilder,
  sellEventPayloadBuilder,
  createPoolEventPayloadBuilder,
} from "./utils/helpers.js";
import { kols } from "./utils/kols.js";
import { kolPumpSwapTradeMessageBuilder } from "./utils/helpers.js";

import env from "dotenv";
env.config();

export function heliusPumpSwapSocket(ioInstance) {
  const io = ioInstance;

  const ws = new WebSocket(process.env.HELIUS_SOCKET_URL);

  // Map of socketId -> pool addresses array
  const clientPoolsFilters = new Map();

  // Reverse lookup: user -> Set of socketIds subscribed to that user
  const poolToSockets = new Map();

  io.on("connection", (socket) => {
    const { pools } = socket.handshake.query;
    const parsedPools = safeParseArray(pools);

    if (parsedPools.length > 0) clientPoolsFilters.set(socket.id, parsedPools);

    // Add socket.id to poolToSockets  reverse lookup
    for (const user of parsedPools) {
      if (!poolToSockets.has(user)) poolToSockets.set(user, new Set());
      poolToSockets.get(user).add(socket.id);
    }

    socket.on("disconnect", () => {
      // Remove socket from poolToSockets
      const users = clientPoolsFilters.get(socket.id) || [];
      for (const user of users) {
        const set = poolToSockets.get(user);
        if (set) {
          set.delete(socket.id);
          if (set.size === 0) poolToSockets.delete(user);
        }
      }
      clientPoolsFilters.delete(socket.id);
      console.log(`Client disconnected: ${socket.id}`);
    });

    socket.on("updatePools", (newPools) => {
      const parsedPools = safeParseArray(newPools);
      const existingPools = clientPoolsFilters.get(socket.id) || [];

      // Combine existing pools with new ones (avoid duplicates)
      const combinedPoolsSet = new Set([...existingPools, ...parsedPools]);
      const combinedPools = Array.from(combinedPoolsSet).filter(Boolean);

      // Update socket's pool tracking
      clientPoolsFilters.set(socket.id, combinedPools);

      // Add socket to new pools in poolToSockets
      for (const pool of parsedPools) {
        if (!poolToSockets.has(pool)) poolToSockets.set(pool, new Set());
        poolToSockets.get(pool).add(socket.id);
      }

      console.log(`Updated pools for ${socket.id}:`, combinedPools);
    });
  });

  ws.on("open", () => {
    console.log("Connected to Helius WebSocket");
    ws.send(JSON.stringify(pumpSwapLogsMsg));

    // Send a ping every 60 seconds
    setInterval(() => {
      if (ws.readyState === WebSocket.OPEN) {
        ws.send(JSON.stringify({ type: "ping" }));
      }
    }, 60 * 1000);
  });

  ws.on("message", (data) => {
    const result = JSON.parse(data);
    const logs = result?.params?.result?.value?.logs;
    if (!logs) return;

    for (const logLine of logs) {
      if (!logLine.startsWith("Program data: ")) continue;

      const base64String = logLine.slice("Program data: ".length);
      const buffer = Buffer.from(base64String, "base64");

      const prefix = buffer.slice(0, 8);
      const matchedEvent = pumpSwapEvents.find((event) =>
        Buffer.from(event.discriminator).equals(prefix)
      );
      if (!matchedEvent) continue;

      const dataBuffer = buffer.slice(8);
      const event = matchedEvent.name;

      if (event === "CreatePoolEvent") {
        const data = CreatePoolEventLayout.decode(dataBuffer);
        const payload = createPoolEventPayloadBuilder(data);
        io.emit("poolCreation", payload);
      }

      if (event === "BuyEvent" || event === "SellEvent") {
        const data =
          event === "BuyEvent"
            ? BuyEventLayout.decode(dataBuffer)
            : SellEventLayout.decode(dataBuffer);

        const payload =
          event === "BuyEvent"
            ? buyEventPayloadBuilder(data)
            : sellEventPayloadBuilder(data);
        // console.log(data.user);
        const matchingKols = kols.filter(
          (kol) => kol.wallet === data.user.toBase58()
        );
        // console.log(payload);
        if (matchingKols.length > 0) {
          for (const kol of matchingKols) {
            /*
            {
              kol: 'Jijo',
              timestamp: '1751067866',
              timestamp: '1751067866',
              base_amount_out: '13430891842204',
              max_quote_amount_in: '4950000000',
              user_base_token_reserves: '0',
              user_quote_token_reserves: '4950000000',
              pool_base_token_reserves: '229494810134688',
              pool_quote_token_reserves: '79392899232',
              quote_amount_in: '4935194414',
              lp_fee_basis_points: '20',
              lp_fee: '9870389',
              protocol_fee_basis_points: '5',
              protocol_fee: '2467598',
              quote_amount_in_with_lp_fee: '4945064803',
              user_quote_amount_in: '4949999999',
              pool: 'BU1ZnX52nJgJqrpzed3yPqVxExnmjLSQ9LMAvP8XEwWk',
              user: '4BdKaxN8G6ka4GYtQQWk4G4dZRUTX2vQH9GcXdBREFUk',
              user_base_token_account: 'JAThBiuhT7xCZQ7tkkB8YmN2pWXV5zDfZg8gHy4X81HB',
              user_quote_token_account: '7eZhfsNkmasanveZWMi7vcS2crp2Rp5UGcD6e2YFaEge',
              protocol_fee_recipient: '7hTckgnGnLQR6sdH7YkqFTAA7VwTfYFaZ6EhEsU3saCX',
              protocol_fee_recipient_token_account: 'X5QPJcpph4mBAJDzc4hRziFftSbcygV59kRb2Fu6Je1',
              type: 'Buy'
            }
         */

            const response = kolPumpSwapTradeMessageBuilder(kol, payload);

            io.emit("kolPoolTrade", response);
          }
        }
        const poolAddress = payload.pool;
        const interestedSockets = poolToSockets.get(poolAddress);
        if (interestedSockets) {
          for (const socketId of interestedSockets) {
            io.to(socketId).emit("poolTrade", payload);
          }
        }
      }
    }
  });

  ws.on("error", (err) => {
    console.error("WebSocket error:", err);
  });

  ws.on("close", () => {
    console.warn("WebSocket closed, retrying in 5 seconds...");
    setTimeout(() => heliusPumpSwapSocket(io), 5000);
  });
}
