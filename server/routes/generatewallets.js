import express from "express";
import bs58 from "bs58";
import { Keypair } from "@solana/web3.js";

import { requestTracker } from "../utils/requests.js";

const generateWalletsRouter = express.Router();

generateWalletsRouter.post("/", (req, res) => {
  const { amount } = req.body;
  requestTracker.totalRequests++;

  const count = parseInt(amount);
  if (count <= 0 || count > 1000) {
    return res.status(400).json({ error: "Invalid amount" });
  }

  const walletArray = [];

  for (let i = 0; i < count; i++) {
    const kp = Keypair.generate();
    walletArray.push({
      publicKey: kp.publicKey.toBase58(),
      privateKey: bs58.encode(kp.secretKey),
    });
  }

  res.json({ walletArray });
});

export default generateWalletsRouter;
