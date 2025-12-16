import { heliusRPCURL } from "../utils/constants.js";
import { AccountLayout, getAssociatedTokenAddress } from "@solana/spl-token";
import { PublicKey } from "@solana/web3.js";

const getMintBalances = async (addresses) => {
  try {
    const response = await fetch(heliusRPCURL(), {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        jsonrpc: "2.0",
        id: 1,
        method: "getMultipleAccounts",
        params: [
          addresses,
          {
            encoding: "base64",
          },
        ],
      }),
    });

    const data = await response.json();
    // Decode each account's data
    const balances = data.result.value.map((account) => {
      if (account && account.data[0]) {
        const buffer = Buffer.from(account.data[0], "base64");
        const tokenAccount = AccountLayout.decode(buffer);
        return Number(tokenAccount.amount);
      }
      return 0;
    });

    console.log(balances);
  } catch (error) {
    console.error("Error:", error);
    throw error;
  }
};

const getTokenAccount = async () => {
  const ata = await getAssociatedTokenAddress(
    new PublicKey("3UfknvCm4No13GHBPwNvXqJt9kroZcPv3psWswqpzixt"),
    new PublicKey("BDgELZPPDoVCH5wX9G7fSyKk3cEuZEakSmqvrjqT6Ca6"), // Owner of the token account
    false // allowOwnerOffCurve = false (standard)
  );
  return ata;
};

// 🔧 Example usage:
(async () => {
  const key = await getTokenAccount();
  const pubkeys = [key.toBase58()];
  console.log(pubkeys);
  const result = await getMintBalances(pubkeys);
  console.log(JSON.stringify(result, null, 2));
})();
