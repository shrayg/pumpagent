import { getAccount } from "@solana/spl-token";
import { Connection, PublicKey } from "@solana/web3.js";
import { solConnection } from "../utils/constants.js";

const connection = new Connection("https://api.mainnet-beta.solana.com");
const tokenAccountPubkey = new PublicKey(
  "8nSUFX1hQYPC5AmL864MsEoTJMULSTctRAEJawkxiioz"
);

const tokenAccount = await getAccount(connection, tokenAccountPubkey);
console.log("Mint address:", tokenAccount.mint.toBase58());

const getMintTokenAccount = async (account) =>
  (await getAccount(solConnection(), new PublicKey(account))).mint.toBase58();

const mint = await getMintTokenAccount(
  "8Z4bUWuoTqX3pHtbFtYscCTnp4da59tvERbLmZGRdyrX"
);
console.log(mint);
