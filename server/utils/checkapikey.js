import { apiKeyMap } from "./loadapikeys.js";

// Middleware function
export function checkApiKey(req, res, next) {
  const apiKey = req.headers["x-api-key"];
  if (!apiKey || !apiKeyMap.has(apiKey)) {
    return res
      .status(401)
      .json({ error: "Invalid request or missing API key." });
  }

  const tier = apiKeyMap.get(apiKey);
  req.tier = tier;
  req.apiKey = apiKey;
  next();
}
