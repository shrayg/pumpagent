import { io } from "socket.io-client";
import { PublicKey } from "@solana/web3.js";

const subscribedPools = ["EjqUYoawPr5oqo2kRDTEJ3DpLqLDKXhoJgZaYyGRAJLu"];

const socket = io("wss://dply.help", {
  transports: ["websocket"], // force WebSocket transport
  query: {
    pools: JSON.stringify(subscribedPools), // ✅ add pools to query string
  },
});

socket.on("connect", () => {
  console.log("✅ Connected to WebSocket.");
});

socket.on("tokenMigration", (migration) => {
  console.log("📦 New Migration:", migration);
  // Handle the migration data here
});

socket.on("poolCreation", async (creation) => {
  console.log("📦 New Pool:", creation);
  // Handle the migration data here

  const res = await fetch(
    "https://lite-api.jup.ag/price/v2?ids=So11111111111111111111111111111111111111112&vsToken=EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v"
  );
  const { data } = await res.json();

  // Extract the price
  const solPrice = parseFloat(
    data["So11111111111111111111111111111111111111112"]
  ).price;
  // console.log(solPrice);
  const totalSupply = 1_000_000_000;

  let pricePerTokenInSOL;
  const tokens = creation.pool_base_amount;
  const sol = creation.pool_quote_amount;

  const parsedSol = Number((sol / 1e9).toFixed(5));
  const parsedTokens = Number(tokens / 1e6);

  pricePerTokenInSOL = parsedSol / parsedTokens;
  const pricePerTokenInUSD = pricePerTokenInSOL * solPrice;
  const marketCap = (totalSupply * pricePerTokenInUSD) / 1000;
  // console.log("Marketcap: ", marketCap);
});

// const res = await fetch("https://api.raydium.io/v2/main/price");
// const data = await res.json();

// const solPrice = data["So11111111111111111111111111111111111111112"];

// socket.on("poolTrade", (trade) => {
//   console.log(trade);
//   const pool = trade.pool;
//   if (pool === "EjqUYoawPr5oqo2kRDTEJ3DpLqLDKXhoJgZaYyGRAJLu")
//     console.log("📦 New Pool Trade:", trade);

//   const totalSupply = 1_000_000_000;
//   let pricePerTokenInSOL;
//   const tokens = Number(trade.pool_base_token_reserves);
//   const sol = Number(trade.pool_quote_token_reserves);
//   const parsedSol = Number((sol / 1e9).toFixed(5));
//   const parsedTokens = Number(tokens / 1e6);

//   pricePerTokenInSOL = parsedSol / parsedTokens;
//   const pricePerTokenInUSD = pricePerTokenInSOL * 146;
//   const marketCap = (totalSupply * pricePerTokenInUSD) / 1000;

//   // Mint AtSfnennv6EVi5wfYi4AjoRFAL8DPs5XzFKCxVXHpump
//   // Pool AcR2HDqjs18EYZRak9ZzqTKPkPuS1qSTE5mtsxFgiaEn

//   // if (pool === "85BifULKX99NZi94VrVWc7MinMbjbuurqoHiZXGoJSam")
//   //   console.log("Marketcap: ", marketCap);
// });

socket.on("disconnect", () => {
  console.log("❌ Disconnected from WebSocket.");
});

// Graceful shutdown
process.on("SIGINT", () => {
  console.log("🔌 Closing connection...");
  socket.disconnect();
  process.exit();
});

/*
📦 New Pool: {
  timestamp: 1750861357,
  index: 0,
  creator: 'FxBpdcinw64AsmPLYzCTW5QudGuMf7yChcMNrqGhZiuZ',
  base_mint: '6ZS4xPTjjFzB5kXyvQvcZvNSGgwxweymVJQkig6Hpump',
  quote_mint: 'So11111111111111111111111111111111111111112',
  base_mint_decimals: 6,
  quote_mint_decimals: 9,
  base_amount_in: '206900000000000',
  quote_amount_in: '84990359094',
  pool_base_amount: '206900000000000',
  pool_quote_amount: '84990359094',
  minimum_liquidity: '100',
  initial_liquidity: '4193388283542',
  lp_token_amount_out: '4193388283442',
  pool_bump: 255,
  pool: 'GQmM4RZ1Ko6vfR94shRdbT2mcRra2L2V489VWykM2eTG',
  lp_mint: 'CyQsZbCWnYm3tp2u5Z42dfjCEwKQY4b4GpF63muz1CSR',
  user_base_token_account: '9VkE7uwM1DBFboLcr9UvV93fRDTAc1Fo5xCAXAxfmBNZ',
  user_quote_token_account: '6TgsGozKqFzhVBVvavVGroqVfja5RUpVGZ8eud5ag7q1'
}
*/
