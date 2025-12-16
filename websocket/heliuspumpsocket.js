import WebSocket from "ws";
import {
  CreateEventLayout,
  CompleteEventLayout,
  TradeEventLayout,
  pumpEvents,
  pumpLogsMsg,
} from "./utils/constants.js";
import {
  completeEventPayloadBuildler,
  createEventPayloadBuilder,
  safeParseArray,
  tradeEventPayloadBuilder,
} from "./utils/helpers.js";

import { kols } from "./utils/kols.js";
import env from "dotenv";
env.config();

export function heliusPumpSocket(ioInstance) {
  const io = ioInstance;

  const ws = new WebSocket(process.env.HELIUS_SOCKET_URL);

  // Map of socketId -> mint addresses array
  const clientMintFilters = new Map();

  // Map of socketId -> users addresses array
  const clientUsersFilters = new Map();

  // Reverse lookup: mint -> Set of socketIds subscribed to that mint
  const mintToSockets = new Map();

  // Reverse lookup: user -> Set of socketIds subscribed to that user
  const userToSockets = new Map();

  io.on("connection", (socket) => {
    const { mints, users } = socket.handshake.query;
    const parsedUsers = safeParseArray(users);
    const parsedMints = safeParseArray(mints);
    console.log("Mint to sockets: ", mintToSockets);
    console.log("Users to sockets: ", userToSockets);
    // if (parsedUsers.length === 0 && parsedMints.length === 0) return;

    if (parsedMints.length > 0) clientMintFilters.set(socket.id, parsedMints);
    if (parsedUsers.length > 0) clientUsersFilters.set(socket.id, parsedUsers);

    // Add socket.id to mintToSockets reverse lookup
    for (const mint of parsedMints) {
      if (!mintToSockets.has(mint)) mintToSockets.set(mint, new Set());
      mintToSockets.get(mint).add(socket.id);
    }

    // Add socket.id to userToSockets reverse lookup
    for (const user of parsedUsers) {
      if (!userToSockets.has(user)) userToSockets.set(user, new Set());
      userToSockets.get(user).add(socket.id);
    }

    socket.on("disconnect", () => {
      // Remove socket from mintToSockets
      const mints = clientMintFilters.get(socket.id) || [];
      for (const mint of mints) {
        const set = mintToSockets.get(mint);
        if (set) {
          set.delete(socket.id);
          if (set.size === 0) mintToSockets.delete(mint);
        }
      }
      clientMintFilters.delete(socket.id);

      // Remove socket from userToSockets
      const users = clientUsersFilters.get(socket.id) || [];
      for (const user of users) {
        const set = userToSockets.get(user);
        if (set) {
          set.delete(socket.id);
          if (set.size === 0) userToSockets.delete(user);
        }
      }
      clientUsersFilters.delete(socket.id);

      console.log(`Client disconnected: ${socket.id}`);
    });

    socket.on("updateMints", (newMints) => {
      const parsedMints = safeParseArray(newMints);

      // Add socket to new mints in mintToSockets before removing old ones
      for (const mint of parsedMints) {
        if (!mintToSockets.has(mint)) mintToSockets.set(mint, new Set());
        mintToSockets.get(mint).add(socket.id);
      }

      // Then remove old mints
      const oldMints = clientMintFilters.get(socket.id) || [];
      for (const mint of oldMints) {
        if (!parsedMints.includes(mint)) {
          const socketSet = mintToSockets.get(mint);
          if (socketSet) {
            socketSet.delete(socket.id);
            if (socketSet.size === 0) {
              mintToSockets.delete(mint);
            }
          }
        }
      }

      // Update clientMintFilters
      clientMintFilters.set(socket.id, parsedMints);

      // console.log(`Updated mints for ${socket.id}:`, parsedMints);
    });
  });

  ws.on("open", () => {
    console.log("Connected to Helius Pump WebSocket");
    ws.send(JSON.stringify(pumpLogsMsg));

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
      const matchedEvent = pumpEvents.find((event) =>
        Buffer.from(event.discriminator).equals(prefix)
      );
      if (!matchedEvent) continue;

      const dataBuffer = buffer.slice(8);
      const event = matchedEvent.name;

      if (event === "TradeEvent") {
        const data = TradeEventLayout.decode(dataBuffer);
        const payload = tradeEventPayloadBuilder(data);

        const payloadMint = payload.mint;
        const payloadRecipient = payload.recipient;

        // Emit to clients subscribed to this mint
        const mintSubscribers = mintToSockets.get(payloadMint);

        if (mintSubscribers) {
          for (const socketId of mintSubscribers) {
            const clientSocket = io.sockets.sockets.get(socketId);
            if (clientSocket) clientSocket.emit("tokenTrades", payload);
          }
        }

        // Emit to clients subscribed to this user/wallet
        const userSubscribers = userToSockets.get(payloadRecipient);
        if (userSubscribers) {
          for (const socketId of userSubscribers) {
            const clientSocket = io.sockets.sockets.get(socketId);
            if (clientSocket) clientSocket.emit("userTrades", payload);
          }
        }

        // Check if payloadRecipient matches any wallet in kols array
        const matchingKol = kols.find((kol) => kol.wallet === payloadRecipient);
        if (matchingKol) {
          payload.kol = matchingKol.name;
          payload.kol_twitter = matchingKol.twitter;
          payload.message = `${matchingKol.name} ${
            payload.type === "Buy" ? "bought" : "sold"
          } ${
            payload.type === "Buy"
              ? payload.tokens_received / 1e6 +
                " tokens for " +
                payload.sol_buy / 1e9 +
                " SOL"
              : payload.tokens_sold / 1e6 +
                " tokens" +
                " for " +
                payload.sol_received / 1e9 +
                " SOL"
          }`;
          delete payload.recipient;
          io.emit("kolTrades", payload);
        }
      }

      if (event === "CreateEvent") {
        const create = CreateEventLayout.decode(dataBuffer);
        const payload = createEventPayloadBuilder(create);
        io.emit("tokenCreation", payload);
        continue;
      }

      if (event === "CompleteEvent") {
        const data = CompleteEventLayout.decode(dataBuffer);
        const payload = completeEventPayloadBuildler(data);
        io.emit("tokenMigration", payload);
      }
    }
  });

  ws.on("error", (err) => {
    console.error("WebSocket error:", err);
  });

  ws.on("close", () => {
    console.warn("WebSocket closed, retrying in 5 seconds...");
    setTimeout(() => heliusPumpSocket(io), 5000);
  });
}
