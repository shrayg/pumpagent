import express from "express";
import jwt from "jsonwebtoken";
import supabase from "../utils/supabase.js";

const getTierPaymentWalletRouter = express.Router();

getTierPaymentWalletRouter.post("/", async (req, res) => {
  const { proof } = req.body;

  const decoded = jwt.decode(proof, { complete: true });
  if (!decoded) throw new Error("Invalid.");

  const user = decoded.payload.email.split("@")[0];

  try {
    const { data, error } = await supabase
      .from("usertierpayments")
      .select("pubKey")
      .eq("username", user);

    if (error) throw new Error(error);
    const result = data[0].pubKey;

    res.json({ pubKey: result });
  } catch (err) {
    console.error("Error fetching wallet data:", err.message);
    res.status(500).json({ error: "Failed to fetch wallet data." });
  }
});

export default getTierPaymentWalletRouter;
