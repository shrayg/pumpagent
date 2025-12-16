import express from "express";
import jwt from "jsonwebtoken";
import supabase from "../utils/supabase.js";

const updateDiscordProfileRouter = express.Router();

updateDiscordProfileRouter.post("/", async (req, res) => {
  const { proof, discordUser } = req.body;

  try {
    const decoded = jwt.decode(proof, { complete: true });
    if (!decoded) throw new Error("Invalid withdrawal.");

    const user = decoded.payload.email.split("@")[0];

    const { error } = await supabase
      .from("users")
      .update({ discord_name: discordUser })
      .eq("username", user);

    if (error) throw new Error("Failed to update user.");

    res.json({ success: true });
  } catch (error) {
    console.error("Error:", error);
    res.status(200).json({ success: false });
  }
});

export default updateDiscordProfileRouter;
