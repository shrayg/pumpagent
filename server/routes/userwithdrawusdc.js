import express from "express";
import { buildTransferTokensTransaction } from "gill/programs/token";
import {
  signTransactionMessageWithSigners,
  createSolanaClient,
  address,
  createKeyPairSignerFromBytes,
} from "gill";
import jwt from "jsonwebtoken";
import supabase from "../utils/supabase.js";
import { solConnection, solRPCURL, USDC_MINT } from "../utils/constants.js";
import { PublicKey } from "@solana/web3.js";
import bs58 from "bs58";
import { getAccount, getAssociatedTokenAddress } from "@solana/spl-token";
const userWithdrawUSDCRouter = express.Router();

userWithdrawUSDCRouter.post("/", async (req, res) => {
  const { proof, api_key, targetWallet, targetPercentage } = req.body;

  try {
    const decoded = jwt.decode(proof, { complete: true });
    if (!decoded || !api_key || !targetWallet || !targetPercentage)
      throw new Error("Invalid withdrawal.");

    const { rpc, sendAndConfirmTransaction } = createSolanaClient({
      urlOrMoniker: solRPCURL(),
    });

    const user = decoded.payload.email.split("@")[0];
    const feeEarningWallet = api_key?.split("-").slice(1, -1).join("");

    // Check if API key is from the valid withdrawer
    const { data, error } = await supabase
      .from("users")
      .select("username, withdrawals")
      .eq("api_key", api_key);

    if (error) throw new Error("Invalid withdrawal.");

    const foundUser = data[0].username;
    if (foundUser !== user) throw new Error("Invalid withdrawal.");
    const withdrawals = JSON.parse(data[0].withdrawals);

    // CHeck if fee earning wallet matches DB entry
    const { data: feeData, error: feeError } = await supabase
      .from("feewallets")
      .select("pubKey, privKey")
      .eq("username", user);

    if (feeError) throw new Error("Invalid withdrawal.");
    const foundWallet = feeData[0].pubKey;
    if (foundWallet !== feeEarningWallet)
      throw new Error("Invalid withdrawal.");
    // Valid withdrawal, proceed

    // Check if user has enough USDC balance
    const feePayer = await createKeyPairSignerFromBytes(
      bs58.decode(feeData[0].privKey)
    );
    const feeEarningPubKey = new PublicKey(feeEarningWallet);
    const feeEarnAta = await getAssociatedTokenAddress(
      USDC_MINT,
      feeEarningPubKey
    );
    const accountData = await getAccount(
      solConnection(),
      feeEarnAta,
      "confirmed"
    );
    const usdcBalance = Math.floor(Number(accountData?.amount) / 1e6) ?? 0;
    if (usdcBalance === 0) throw new Error("Insufficient USDC to withdraw.");

    const targetTransferAmount = Number(
      ((usdcBalance * targetPercentage) / 100).toFixed(2)
    );

    const newBalanceFormatted = usdcBalance - targetTransferAmount;

    const { value: latestBlockhash } = await rpc.getLatestBlockhash().send();

    const mint = address("EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v");
    const destination = address(targetWallet);
    const transaction = await buildTransferTokensTransaction({
      feePayer,
      version: "legacy",
      latestBlockhash,
      mint,
      authority: feePayer,
      amount: targetTransferAmount * 1e6,
      destination,
    });

    const signedTransaction = await signTransactionMessageWithSigners(
      transaction
    );

    const signature = await sendAndConfirmTransaction(signedTransaction);
    if (!signature) throw new Error("Failed to confirm transaction.");

    const newWithdrawal = {
      date: Math.floor(Date.now() / 1000),
      amount: targetTransferAmount,
      currency: "USDC",
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

export default userWithdrawUSDCRouter;
