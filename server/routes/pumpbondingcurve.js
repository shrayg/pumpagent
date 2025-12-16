import express from "express";
import { PublicKey } from "@solana/web3.js";
import { PUMP_FUN_PROGRAM, solConnection } from "../utils/constants.js";
import { getAccount, getAssociatedTokenAddressSync } from "@solana/spl-token";
import { requestTracker } from "../utils/requests.js";

const pumpBondingCurveRouter = express.Router();

pumpBondingCurveRouter.post("/", async (req, res) => {
  const { ca } = req.body;
  requestTracker.totalRequests++;

  const mint = new PublicKey(ca);

  // Curve data
  const [bondingCurve] = PublicKey.findProgramAddressSync(
    [Buffer.from("bonding-curve"), mint.toBuffer()],
    PUMP_FUN_PROGRAM
  );

  const associatedBondingCurve = getAssociatedTokenAddressSync(
    mint,
    bondingCurve,
    true
  );

  try {
    const tokenAccount = await getAccount(
      solConnection(),
      associatedBondingCurve
    );
    console.log(tokenAccount);
    const tokenAmount = Number(tokenAccount.amount);
    const DECIMALS = 10 ** 6;
    console.log("Token amount: ", tokenAmount);

    const bondingCurveProgress =
      ((1_000_000_000 * DECIMALS - tokenAmount) * 100) /
      (800_000_000 * DECIMALS);

    res.json({
      curveProgress:
        bondingCurveProgress > 100 ? 100 : Math.ceil(bondingCurveProgress),
    });
  } catch (err) {
    console.error(err);
  }
});

export default pumpBondingCurveRouter;
