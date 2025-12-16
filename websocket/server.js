import express from "express";
import http from "http";
import { Server } from "socket.io";
import rateLimit from "express-rate-limit";
import { heliusPumpSocket } from "./heliuspumpsocket.js";
import { heliusPumpSwapSocket } from "./heliuspumpswapsocket.js";

const app = express();
const server = http.createServer(app);

const PORT = process.env.port || 4000;

// === HTTP RATE LIMITING ===
const limiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 60, // max 60 requests per minute per IP
  standardHeaders: true,
  legacyHeaders: false,
});
app.use(limiter);

const io = new Server(server, {
  cors: {
    origin: "*", // Replace with your frontend domain in production
    pingInterval: 10000, // send ping every 10 seconds
    pingTimeout: 5000, // if no pong in 5 seconds, consider disconnected
  },
});

// === SOCKET.IO RATE LIMITING ===
const connectionCounts = new Map();

// 🔽 Add this block here, after initializing `io`
io.on("connection", (socket) =>
  console.log(`Socket connected: ${socket.id} from ${socket.handshake.address}`)
);

io.use((socket, next) => {
  const ip = socket.handshake.address;
  const count = connectionCounts.get(ip) || 0;

  if (count >= 20) {
    return next(new Error("Too many socket connections from this IP"));
  }

  connectionCounts.set(ip, count + 1);

  setTimeout(() => {
    const newCount = (connectionCounts.get(ip) || 1) - 1;
    if (newCount <= 0) {
      connectionCounts.delete(ip);
    } else {
      connectionCounts.set(ip, newCount);
    }
  }, 60000);

  next();
});

// Initialize the Solana WebSocket relay
heliusPumpSocket(io);
heliusPumpSwapSocket(io);

setInterval(() => {
  const count = io.sockets.sockets.size;
  console.log(`Connected clients: ${count}`);
}, 60000); // logs every 60 seconds

server.listen(PORT, () => {
  console.log(`Server listening on http://localhost:${PORT}`);
});
