import anchor from "@coral-xyz/anchor";
import { PublicKey, Keypair } from "@solana/web3.js";
import { solConnection } from "../utils/constants.js";
import IDL from "../utils/pumpfun-IDL.json" with { type: "json" };

const provider = new anchor.AnchorProvider(
  solConnection(),
  new anchor.Wallet(Keypair.generate()),
  { commitment: "confirmed" }
);

// Init program
const program = new anchor.Program(IDL, provider);

// Method 1: Using Anchor Program
const getTokenCurve  = async (ca) => {
  try {
    // Derive the bonding curve PDA
    const [bondingCurvePda] = PublicKey.findProgramAddressSync(
      [Buffer.from("bonding-curve"), new PublicKey(ca).toBuffer()],
      program.programId
    );

    // Fetch the bonding curve account
    const bondingCurveAccount = await program.account.bondingCurve.fetch(
      bondingCurvePda
    );
    console.log(bondingCurveAccount)
    return bondingCurveAccount;
  } catch (error) {
    console.error("Error fetching bonding curve:", error);
    throw error;
  }
}

console.log(await getTokenCurve("65QwxNtbekrrFuZrQtUCNHqSnrjderAoiNENwGijpump"))
