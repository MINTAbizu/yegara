import express from "express";
import { loginTelegramMiniAppUser } from "../../utils/telegramAuth.js";

const router = express.Router();

router.post("/telegram-login", loginTelegramMiniAppUser);

export default router;


const crypto = require("crypto");
const User = require("../models/User"); // Your user model
const jwt = require("jsonwebtoken");

app.post("/api/auth/telegram-login", async (req, res) => {
  const { initData } = req.body;
  const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;

  const urlParams = new URLSearchParams(initData);
  const hash = urlParams.get("hash");
  urlParams.delete("hash");

  // Validate hash against bot token
  const validParams = Array.from(urlParams.entries())
    .map(([key, val]) => `${key}=${val}`)
    .sort()
    .join("\n");

  const secretKey = crypto.createHmac("sha256", "WebAppData").update(BOT_TOKEN).digest();
  const calculatedHash = crypto.createHmac("sha256", secretKey).update(validParams).digest('hex');

  if (calculatedHash !== hash) {
    return res.status(401).json({ message: "Invalid Telegram authentication" });
  }

  const tgUser = JSON.parse(urlParams.get("user"));

  // Find or create user based on Telegram ID
  let user = await User.findOne({ telegramId: tgUser.id });
  if (!user) {
    user = await User.create({
      telegramId: tgUser.id,
      name: `${tgUser.first_name} ${tgUser.last_name || ""}`.trim(),
      email: `${tgUser.id}@telegram.user`,
      role: "user",
    });
  }

  const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET);
  res.json({ token, user });
});