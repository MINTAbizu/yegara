import TelegramBot from "node-telegram-bot-api";
import EqubChallenge from "./models/EqubChallenge.model.js";

const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
const MINI_APP_URL = (process.env.FRONTEND_URL || process.env.CLIENT_URL || "http://localhost:5173").replace(/\/$/, "");

export const bot = BOT_TOKEN ? new TelegramBot(BOT_TOKEN, { polling: true }) : null;

const challengeMiniAppUrl = (challenge) => {
  const page = challenge.fundingType === "PRODUCT_LOCKED" ? "crowdfunding-billing" : "crowdfunding";
  return `${MINI_APP_URL}/${page}?challengeId=${challenge._id}`;
};

if (bot) {
  bot.onText(/\/start/, async (msg) => {
    await bot.sendMessage(
      msg.chat.id,
      `Welcome ${msg.from.first_name || "there"}!\n\nJoin active Crowdfunding and Crowdfunding Billing rounds directly from the Telegram mini app.`,
      {
        reply_markup: {
          inline_keyboard: [[{ text: "View Active Challenges", callback_data: "list_challenges" }]],
        },
      }
    );
  });

  bot.on("callback_query", async (query) => {
    if (query.data !== "list_challenges") return;

    await bot.answerCallbackQuery(query.id);

    const challenges = await EqubChallenge.find({
      status: "PENDING",
      expiresAt: { $gt: new Date() },
    }).lean();

    if (challenges.length === 0) {
      await bot.sendMessage(query.message.chat.id, "No active crowdfunding challenges available right now.");
      return;
    }

    for (const challenge of challenges) {
      const filled = Array.isArray(challenge.filledSlots) ? challenge.filledSlots.length : 0;
      const total = challenge.totalSlots;
      const mode = challenge.fundingType === "PRODUCT_LOCKED" ? "Crowdfunding Billing" : "Crowdfunding";
      const text = `${challenge.title || "Equb Challenge"}\n${mode}\nSlot Price: ${challenge.slotPrice} ETB\nSlots: ${filled}/${total}`;

      await bot.sendMessage(query.message.chat.id, text, {
        reply_markup: {
          inline_keyboard: [[{ text: "Join in Mini App", web_app: { url: challengeMiniAppUrl(challenge) } }]],
        },
      });
    }
  });
}
