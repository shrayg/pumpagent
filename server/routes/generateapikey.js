import express from "express";
import jwt from "jsonwebtoken";
import supabase from "../utils/supabase.js";
import { updateAPIKey } from "../utils/helpers.js";
import { apiKeyMap } from "../utils/loadapikeys.js";

const generateApiKeyRouter = express.Router();

generateApiKeyRouter.post("/", async (req, res) => {
  const { proof, apiKey } = req.body;

  const decoded = jwt.decode(proof, { complete: true });
  if (!decoded) throw new Error("Invalid token.");

  const user = decoded.payload.email.split("@")[0];
  const newKey = updateAPIKey(apiKey);

  const { error } = await supabase
    .from("users")
    .update({
      api_key: newKey,
    })
    .eq("username", user);
  if (error) throw new Error(error);

  const tier = apiKeyMap.get(apiKey);
  apiKeyMap.delete(apiKey);
  apiKeyMap.set(newKey, tier);
  try {
    res.json({ newKey });
  } catch (err) {
    console.error(err.message);
  }
});

export default generateApiKeyRouter;
