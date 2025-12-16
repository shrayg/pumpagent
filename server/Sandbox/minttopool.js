import { PublicKey, Keypair } from "@solana/web3.js";
import { heliusConnection, solConnection } from "../utils/constants.js";
import { Program } from "@coral-xyz/anchor";

import IDL from "../utils/pumpswapidl.json" with { type: "json" };

// 📦 New Migration: {
//   creator: '9cqz5aF3pggKzF6bdiYYsJ8moKuc7hXzr1kXPakh4Q6g',
//   mint: 'AyvxYpgLLZTF4LoUmLXShptBig24qm91n4M4cQLEpump',
//   timestamp: 1750629484
// }
// 📦 New Pool: {
//   timestamp: 1750629485,
//   index: 0,
//   creator: 'BfvQq6MN97MzFc82WeefwyXa2VYPrwRYTt5PMEtkVT74',
//   base_mint: 'AyvxYpgLLZTF4LoUmLXShptBig24qm91n4M4cQLEpump',
//   quote_mint: 'So11111111111111111111111111111111111111112',
//   base_mint_decimals: 6,
//   quote_mint_decimals: 9,
//   base_amount_in: '206900000000001',
//   quote_amount_in: '84990363174',
//   pool_base_amount: '206900000000001',
//   pool_quote_amount: '84990363174',
//   minimum_liquidity: '100',
//   initial_liquidity: '4193388384194',
//   lp_token_amount_out: '4193388384094',
//   pool_bump: 252,
//   pool: '6nBzxmwj7mzzQUGVdmi8PwSGiegPSviyWZ5pSDM66gCP',
//   lp_mint: '4xGrCZBRExnW6CtNFkqMCX53vRGDV3JkRXETX8ytzZh9',
//   user_base_token_account: '5RZ9caM6UU2KgdWpnRkdGJaqBnQfKmwKHnEr5bkGvpfZ',
//   user_quote_token_account: '5j7jDDTyzuaoe8UcaNv2TEL8zVMWwQFtxRjDMzYaKZMM'
// }

function getPumpPoolPdaString(baseMintStr) {
  const quoteMint = new PublicKey("So11111111111111111111111111111111111111112");
  const AMM = new PublicKey("pAMMBay6oceH9fJKBRHGP5D4bD4sWpmSwMn52FMfXEA");
  const PUMP = new PublicKey("6EF8rrecthR5Dkzon8Nwu78hRvfCKubJ14M5uBEwF6P");

  const baseMint = new PublicKey(baseMintStr);

  const [poolAuthority] = PublicKey.findProgramAddressSync(
    [Buffer.from("pool-authority"), baseMint.toBuffer()],
    PUMP
  );

  const indexBuffer = Buffer.from([0, 0]);

  const [pool] = PublicKey.findProgramAddressSync(
    [
      Buffer.from("pool"),
      indexBuffer,
      poolAuthority.toBuffer(),
      baseMint.toBuffer(),
      quoteMint.toBuffer(),
    ],
    AMM
  );

  return pool.toBase58();
}

// Example usage:
const result = getPumpPoolPdaString(
  "ERR33cjrwegoEyMaWUH6SgYNZ5ao4169BjqRG2eHSCMt", // Mint
);
console.log("Pool PDA:", result);

// const PUMP_AMM_PROGRAM_ID = new PublicKey(
//   "pAMMBay6oceH9fJKBRHGP5D4bD4sWpmSwMn52FMfXEA"
// );
// const program = new Program(IDL, PUMP_AMM_PROGRAM_ID);

// const WSOL_TOKEN_ACCOUNT = new PublicKey('So11111111111111111111111111111111111111112');
// const getPoolsWithBaseMintQuoteWSOL = async (mintAddress) => {
//   const response = await heliusConnection().getProgramAccounts(
//     PUMP_AMM_PROGRAM_ID,
//     {
//       filters: [
//         { dataSize: 203 },
//         {
//           memcmp: {
//             offset: 35,
//             bytes: mintAddress,
//           },
//         },
//         {
//           memcmp: {
//             offset: 67,
//             bytes: WSOL_TOKEN_ACCOUNT.toBase58(),
//           },
//         },
//       ],
//     }
//   );
//   console.log(response)
//   const mappedPools = response.map((pool) => {
//     const data = Buffer.from(pool.account.data);
//     const poolData = program.coder.accounts.decode("pool", data);
//     return {
//       address: pool.pubkey,
//       is_native_base: true,
//       poolData,
//     };
//   });

//   return mappedPools;
// };

// const getPooldata = async () => {
//   const poolData = await getPoolsWithBaseMintQuoteWSOL(
//     "AyvxYpgLLZTF4LoUmLXShptBig24qm91n4M4cQLEpump"
//   );
//   console.log("POOLDATA: ", poolData)
// };
// getPooldata();
