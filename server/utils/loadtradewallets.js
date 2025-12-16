import supabase from "./supabase.js";

// Main API key value store
export const tradeWalletsMap = new Map();

export async function loadTradeWallets() {
  const { data, error } = await supabase
    .from("koltrader")
    .select("pubKey, privKey")
    .limit(null);

  if (error) return console.error("Failed to load API keys:", error);

  data.forEach(({ pubKey, privKey }) => tradeWalletsMap.set(pubKey, privKey));

  console.log(`Loaded ${tradeWalletsMap.size} Trade Wallets`);
}
