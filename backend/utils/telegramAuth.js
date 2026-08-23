import crypto from "crypto";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../model/user.model/user.model.js";

const JWT_SECRET = process.env.JWT_SECRET || "yourSecretKey";
const JWT_EXPIRES = process.env.JWT_EXPIRES || "1d";
const AUTH_DATE_MAX_AGE_SECONDS = 24 * 60 * 60;

const signToken = (user) => jwt.sign(
  { id: user._id, name: user.name, email: user.email },
  JWT_SECRET,
  { expiresIn: JWT_EXPIRES }
);

export const parseTelegramInitData = (initData) => {
  const params = new URLSearchParams(initData);
  const hash = params.get("hash");

  if (!hash) {
    throw Object.assign(new Error("Telegram auth hash is missing."), { status: 400 });
  }

  params.delete("hash");
  const dataCheckString = Array.from(params.entries())
    .sort(([left], [right]) => left.localeCompare(right))
    .map(([key, value]) => `${key}=${value}`)
    .join("\n");

  return { params, hash, dataCheckString };
};

export const verifyTelegramInitData = (initData) => {
  if (!process.env.TELEGRAM_BOT_TOKEN) {
    throw Object.assign(new Error("Telegram bot token is not configured."), { status: 500 });
  }

  if (!initData) {
    throw Object.assign(new Error("Telegram initData is required."), { status: 400 });
  }

  const { params, hash, dataCheckString } = parseTelegramInitData(initData);
  const secretKey = crypto.createHash("sha256").update(process.env.TELEGRAM_BOT_TOKEN).digest();
  const expectedHash = crypto.createHmac("sha256", secretKey).update(dataCheckString).digest("hex");

  const expectedBuffer = Buffer.from(expectedHash, "hex");
  const receivedBuffer = Buffer.from(hash, "hex");
  if (expectedBuffer.length !== receivedBuffer.length || !crypto.timingSafeEqual(expectedBuffer, receivedBuffer)) {
    throw Object.assign(new Error("Telegram authentication could not be verified."), { status: 401 });
  }

  const authDate = Number(params.get("auth_date"));
  if (!Number.isFinite(authDate) || Date.now() / 1000 - authDate > AUTH_DATE_MAX_AGE_SECONDS) {
    throw Object.assign(new Error("Telegram authentication has expired. Please reopen the mini app."), { status: 401 });
  }

  const telegramUser = JSON.parse(params.get("user") || "null");
  if (!telegramUser?.id) {
    throw Object.assign(new Error("Telegram user data is missing."), { status: 400 });
  }

  return telegramUser;
};

export const loginTelegramMiniAppUser = async (req, res) => {
  try {
    const telegramUser = verifyTelegramInitData(req.body?.initData);
    const telegramId = String(telegramUser.id);
    const name = [telegramUser.first_name, telegramUser.last_name].filter(Boolean).join(" ") || telegramUser.username || "Telegram User";
    const email = `telegram_${telegramId}@telegram.yegara.local`;

    let user = await User.findOne({ email });
    if (!user) {
      user = await User.create({
        name,
        email,
        password: await bcrypt.hash(`telegram:${telegramId}:${process.env.JWT_SECRET || "secret"}`, 10),
        role: "buyer",
      });
    } else if (user.name !== name && name !== "Telegram User") {
      user.name = name;
      await user.save();
    }

    const token = signToken(user);
    return res.status(200).json({
      token,
      user: {
        id: user._id,
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        telegramId,
      },
    });
  } catch (error) {
    return res.status(error.status || 500).json({ message: error.message || "Telegram login failed." });
  }
};
