import express from "express";
import axios from "axios";
import jwt from "jsonwebtoken";
import supabase from "../utils/supabase.js";
import { solConnection, solRPCURL } from "../utils/constants.js";
import {
  SystemProgram,
  PublicKey,
  Keypair,
  sendAndConfirmTransaction,
  Transaction,
} from "@solana/web3.js";
import bs58 from "bs58";

const userWithdrawSolRouter = express.Router();

userWithdrawSolRouter.post("/", async (req, res) => {
  const { proof, api_key, targetWallet, targetPercentage } = req.body;

  try {
    const decoded = jwt.decode(proof, { complete: true });
    if (!decoded || !api_key || !targetWallet || !targetPercentage)
      throw new Error("Invalid withdrawal.");

    const user = decoded.payload.email.split("@")[0];
    const wallet = api_key?.split("-").slice(1, -1).join("");

    const { data, error } = await supabase
      .from("users")
      .select("username, withdrawals")
      .eq("api_key", api_key);

    if (error) throw new Error("Invalid withdrawal.");

    const withdrawals = JSON.parse(data[0].withdrawals);

    const foundUser = data[0].username;
    if (foundUser !== user) throw new Error("Invalid withdrawal.");

    const { data: feeData, error: feeError } = await supabase
      .from("feewallets")
      .select("pubKey, privKey")
      .eq("username", user);

    if (feeError) throw new Error("Invalid withdrawal.");
    const foundWallet = feeData[0].pubKey;
    if (foundWallet !== wallet) throw new Error("Invalid withdrawal.");

    // Valid withdrawal, proceed
    const response = await axios.post(
      solRPCURL(),
      {
        jsonrpc: "2.0",
        id: 1,
        method: "getAccountInfo",
        params: [wallet, { encoding: "base58" }],
      },
      {
        headers: { "Content-Type": "application/json" },
      }
    );
    const bal = response?.data?.result?.value?.lamports;
    const balance = bal ? bal : 0;
    if (balance === 0) throw new Error("Invalid withdrawal.");

    let targetTransferLamports = Math.floor((balance * targetPercentage) / 100);

    // Keep minimum rent in wallet if withdrawal if 100%
    if (targetPercentage === "100") targetTransferLamports -= 2000000;

    const newBalance = balance - targetTransferLamports;
    const newBalanceFormatted = newBalance / 1e9;

    const feePayerKeypair = Keypair.fromSecretKey(
      bs58.decode(feeData[0].privKey)
    );
    const feeWalletPublicKey = feePayerKeypair.publicKey;

    const recipientPublicKey = new PublicKey(targetWallet);

    const feeTransferInstruction = SystemProgram.transfer({
      fromPubkey: feeWalletPublicKey,
      toPubkey: recipientPublicKey,
      lamports: BigInt(targetTransferLamports),
    });

    const { blockhash, lastValidBlockHeight } =
      await solConnection().getLatestBlockhash();

    const transaction = new Transaction({
      recentBlockhash: blockhash,
      feePayer: feeWalletPublicKey,
    }).add(feeTransferInstruction);

    // Sign the transaction
    transaction.sign(feePayerKeypair);

    const signature = await sendAndConfirmTransaction(
      solConnection(),
      transaction,
      [feePayerKeypair],
      { commitment: "finalized" }
    );

    const txResult = await solConnection().confirmTransaction({
      blockhash: blockhash,
      lastValidBlockHeight,
      signature,
    });

    if (txResult?.value?.err) {
      console.error("Transaction failed:", txResult.value.err);
      return res.status(400).json({ error: txResult.value.err });
    }

    const newWithdrawal = {
      date: Math.floor(Date.now() / 1000),
      amount: targetTransferLamports / 1e9,
      currency: "SOL",
      wallet: targetWallet,
      txId: signature,
    };
    withdrawals.push(newWithdrawal);

    const { error: updateError } = await supabase
      .from("users")
      .update({ withdrawals })
      .eq("username", user);

    if (updateError) throw new Error(updateError);

    res.json({ newWithdrawal, newBalanceFormatted });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ error: error.message });
  }
});

export default userWithdrawSolRouter;
