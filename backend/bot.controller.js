import { Bot, InlineKeyboard } from "grammy";
import axios from "axios";
import EqubChallenge from "../models/EqubChallenge.model.js";

const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
const API_URL = process.env.BACKEND_URL || "http://localhost:5000";

export const bot = new Bot(BOT_TOKEN);

// Command: /start
bot.command("start", async (ctx) => {
  await ctx.reply(
    `Welcome ${ctx.from.first_name}! 👋\n\nJoin our active Crowdfunding / Equb Challenges directly from Telegram.`,
    {
      reply_markup: new InlineKeyboard().text("🏆 View Active Challenges", "list_challenges"),
    }
  );
});

// List Active Equb Challenges
bot.callbackQuery("list_challenges", async (ctx) => {
  await ctx.answerCallbackQuery();

  const challenges = await EqubChallenge.find({
    status: "PENDING",
    expiresAt: { $gt: new Date() },
  }).lean();

  if (challenges.length === 0) {
    return ctx.reply("No active crowdfunding challenges available right now.");
  }

  for (const challenge of challenges) {
    const filled = challenge.filledSlots.length;
    const total = challenge.totalSlots;
    const text = `🎯 *${challenge.title || "Equb Challenge"}*\n💰 *Slot Price:* ${challenge.slotPrice} ETB\n👥 *Slots:* ${filled}/${total}`;

    const keyboard = new InlineKeyboard().text(
      "💳 Join & Pay",
      `join_${challenge._id}`
    );

    await ctx.reply(text, { parse_mode: "Markdown", reply_markup: keyboard });
  }
});

// Handle Challenge Selection & Trigger Chapa Payment
bot.callbackQuery(/^join_(.+)$/, async (ctx) => {
  await ctx.answerCallbackQuery();
  const challengeId = ctx.match[1];
  const telegramUserId = ctx.from.id;
  const firstName = ctx.from.first_name || "Telegram User";

  try {
    // 1. Call your existing initializePayment logic internally or via HTTP
    const response = await axios.post(`${API_URL}/api/payments/initialize`, {
      userId: req.user?._id, // Pass mapped MongoDB user ID corresponding to Telegram account
      amount: challenge.slotPrice,
      email: `${telegramUserId}@telegram.user`,
      firstName,
      purpose: "CROWDFUND_JOIN",
      targetId: challengeId,
    });

    const { checkout_url } = response.data;

    // 2. Send Chapa payment URL to user in Telegram
    await ctx.reply(`Click below to complete your payment:`, {
      reply_markup: new InlineKeyboard().url("🔗 Pay with Chapa", checkout_url),
    });
  } catch (error) {
    ctx.reply(error.response?.data?.message || "Failed to initiate payment.");
  }
});

// Start Bot Listener
bot.start();