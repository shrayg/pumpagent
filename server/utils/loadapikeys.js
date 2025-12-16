import supabase from "./supabase.js";

// Main API key value store
export const apiKeyMap = new Map();

export async function loadApiKeys() {
  const { data, error } = await supabase
    .from("users")
    .select("api_key, tier")
    .limit(null);

  if (error) return console.error("Failed to load API keys:", error);

  data.forEach(({ api_key, tier }) => apiKeyMap.set(api_key, tier));

  console.log(`Loaded ${apiKeyMap.size} API keys`);
}
