// // // backend/controller/telegram.controller.js
// // import TelegramBot from "node-telegram-bot-api";
// // import dotenv from "dotenv";
// // dotenv.config();

// // const bot = new TelegramBot(process.env.TELEGRAM_BOT_TOKEN, { polling: true });

// // // Temporary in-memory storage for chat IDs
// // const userChats = {}; // { username: chat_id }

// // // Capture chat ID when user starts the bot
// // bot.onText(/\/start/, (msg) => {
// //   const username = msg.from.username;
// //   if (username) {
// //     userChats[username.toLowerCase()] = msg.from.id;
// //     bot.sendMessage(msg.chat.id, `✅ Welcome, ${username}! You can now receive verification codes.`);
// //   } else {
// //     bot.sendMessage(msg.chat.id, `Please set a Telegram username in your account to use this bot.`);
// //   }
// // });

// // // Send verification code
// // export const sendVerificationCode = async (req, res) => {
// //   try {
// //     const { telegramUsername, code } = req.body;
// //     if (!telegramUsername || !code) return res.status(400).json({ message: "telegramUsername and code required" });

// //     const chatId = userChats[telegramUsername.toLowerCase()];
// //     if (!chatId) return res.status(400).json({ message: "User has not started the bot yet." });

// //     await bot.sendMessage(chatId, `✅ Your verification code is: ${code}`);
// //     return res.json({ message: "Verification code sent successfully" });

// //   } catch (err) {
// //     console.error("Telegram send error:", err.message);
// //     return res.status(500).json({ message: err.message });
// //   }
// // };

// // // Verify group ownership
// // export const verifyGroupOwner = async (req, res) => {
// //   try {
// //     const { chatId, sellerTelegramUsername } = req.body;
// //     if (!chatId || !sellerTelegramUsername) return res.status(400).json({ message: "chatId and username required" });

// //     const sellerId = userChats[sellerTelegramUsername.toLowerCase()];
// //     if (!sellerId) return res.status(400).json({ message: "User has not started the bot yet." });

// //     const admins = await bot.getChatAdministrators(chatId);
// //     const owner = admins.find(a => a.status === "creator" && a.user.id === sellerId);

// //     if (owner) return res.json({ verified: true, message: "Seller owns this group" });
// //     else return res.json({ verified: false, message: "Ownership not verified" });

// //   } catch (err) {
// //     console.error("Telegram verification error:", err.message);
// //     return res.status(500).json({ message: "Verification failed", error: err.message });
// //   }
// // };

// // Get group chat ID by username
// export const getChatId = async (req, res) => {
//   try {
//     const { groupUsername } = req.body;
//     if (!groupUsername) return res.status(400).json({ message: "groupUsername is required" });

//     const chat = await bot.getChat(`@${groupUsername}`);
//     res.json({ chatId: chat.id, title: chat.title });
//   } catch (err) {
//     console.error("Error fetching chat:", err.message);
//     res.status(500).json({
//       message:
//         "Failed to get chat ID. Make sure the group exists and the bot is a member.",
//     });
//   }
// };

// // // Verify ownership
// // // export const verifyGroupOwner = async (req, res) => {
// // //   try {
// // //     const { chatId, sellerTelegramUsername } = req.body;
// // //     if (!chatId || !sellerTelegramUsername) {
// // //       return res.status(400).json({ message: "chatId and sellerTelegramUsername are required" });
// // //     }

// // //     const sellerId = await resolveUsername(sellerTelegramUsername);

// // //     const admins = await bot.getChatAdministrators(chatId);
// // //     const owner = admins.find((a) => a.status === "creator" && a.user.id === sellerId);

// // //     if (owner) {
// // //       return res.json({ verified: true, message: "Seller owns this group" });
// // //     } else {
// // //       return res.json({ verified: false, message: "Ownership not verified" });
// // //     }
// // //   } catch (err) {
// // //     console.error("Verification error:", err.message);
// // //     return res.status(500).json({
// // //       message:
// // //         "Verification failed. Make sure the bot is in the group and username is correct.",
// // //     });
// // //   }
// // // };
// // backend/controller/telegram.controller.js

// import TelegramBot from "node-telegram-bot-api";
// import dotenv from "dotenv";
// dotenv.config();

// const bot = new TelegramBot(process.env.TELEGRAM_BOT_TOKEN, { polling: true });

// // Temporary storage for users who started the bot
// const userChats = {}; // { username: chat_id }

// bot.onText(/\/start/, (msg) => {
//   const username = msg.from.username;
//   if (username) {
//     userChats[username.toLowerCase()] = msg.from.id;
//     bot.sendMessage(msg.chat.id, `✅ Welcome, ${username}! You can now receive verification codes.`);
//   } else {
//     bot.sendMessage(msg.chat.id, `Please set a Telegram username in your account to use this bot.`);
//   }
// });

// // Send verification code to user
// export const sendVerificationCode = async (req, res) => {
//   try {
//     const { telegramUsername, code } = req.body;
//     if (!telegramUsername || !code)
//       return res.status(400).json({ message: "telegramUsername and code are required" });

//     const chatId = userChats[telegramUsername.toLowerCase()];
//     if (!chatId)
//       return res.status(400).json({ message: "User has not started the bot yet." });

//     await bot.sendMessage(chatId, `✅ Your verification code is: ${code}`);
//     return res.json({ message: "Verification code sent successfully" });
//   } catch (err) {
//     console.error("Telegram send error:", err.message);
//     return res.status(500).json({ message: err.message });
//   }
// };

// // Verify private group ownership
// export const verifyGroupOwner = async (req, res) => {
//   try {
//     const { inviteLink, sellerTelegramUsername } = req.body;
//     if (!inviteLink || !sellerTelegramUsername)
//       return res.status(400).json({ message: "Invite link and username are required" });

//     // Extract chatId from invite link (cannot directly; user must add bot first)
//     // For private groups, bot must already be a member
//     const sellerId = userChats[sellerTelegramUsername.toLowerCase()];
//     if (!sellerId)
//       return res.status(400).json({ message: "User has not started the bot yet." });

//     // Ask the user to provide the chat ID from Telegram (or admin can get it)
//     const { chatId } = req.body; // user provides chatId after adding bot
//     if (!chatId)
//       return res.status(400).json({ message: "Chat ID is required. Add bot to group first." });

//     const admins = await bot.getChatAdministrators(chatId);
//     const owner = admins.find(a => a.status === "creator" && a.user.id === sellerId);

//     if (owner)
//       return res.json({ verified: true, message: "Seller owns this private group" });
//     else
//       return res.json({ verified: false, message: "Ownership not verified" });

//   } catch (err) {
//     console.error("Telegram verification error:", err.message);
//     return res.status(500).json({
      
//       message:
//         "Verification failed. Make sure the bot is in the group and username is correct.",
//       error: err.message,
//     });
//   }
// };

import TelegramBot from "node-telegram-bot-api";
import dotenv from "dotenv";
import TelegramUser from "../model/telegramUser.model.js";

dotenv.config();

// Telegram bot instance
const bot = new TelegramBot(process.env.TELEGRAM_BOT_TOKEN, { polling: true });

/* -------------------------------------------
   1️⃣ SAVE USER CHAT ID WHEN THEY RUN /start
--------------------------------------------- */

bot.onText(/\/start/, async (msg) => {
  const username = msg.from.username;
  const chatId = msg.chat.id;

  if (!username) {
    return bot.sendMessage(chatId, "❗ Please set a Telegram username to use this bot.");
  }

  try {
    await TelegramUser.findOneAndUpdate(
      { username: username.toLowerCase() },
      { chatId },
      { upsert: true, new: true }
    );

    bot.sendMessage(chatId, `✅ Welcome ${username}!\nYou can now receive verification codes.`);
  } catch (err) {
    bot.sendMessage(chatId, "❌ Error saving your Telegram data.");
    console.error("Save chatId error:", err.message);
  }
});

/* -------------------------------------------
   2️⃣ SEND VERIFICATION CODE
--------------------------------------------- */

export const sendVerificationCode = async (req, res) => {
  try {
    const { telegramUsername, code } = req.body;

    if (!telegramUsername || !code) {
      return res.status(400).json({ message: "telegramUsername and code are required" });
    }

    const user = await TelegramUser.findOne({
      username: telegramUsername.toLowerCase()
    });

    if (!user) {
      return res.status(400).json({ message: "User has not started the bot yet." });
    }

    await bot.sendMessage(user.chatId, `🔐 Your verification code is: *${code}*`, {
      parse_mode: "Markdown"
    });

    res.json({ message: "Verification code sent successfully" });
  } catch (err) {
    console.error("Telegram send error:", err.message);
    res.status(500).json({ message: err.message });
  }
};

/* -------------------------------------------
   3️⃣ VERIFY GROUP OWNERSHIP
--------------------------------------------- */

export const verifyGroupOwner = async (req, res) => {
  try {
    const { inviteLink, sellerTelegramUsername, chatId } = req.body;

    if (!inviteLink || !sellerTelegramUsername || !chatId) {
      return res.status(400).json({
        message: "inviteLink, sellerTelegramUsername, and chatId are required"
      });
    }

    const seller = await TelegramUser.findOne({
      username: sellerTelegramUsername.toLowerCase()
    });

    if (!seller) {
      return res.status(400).json({ message: "User has not started the bot yet." });
    }

    // Bot must already be in the group
    const admins = await bot.getChatAdministrators(chatId);

    const owner = admins.find(
      (a) => a.status === "creator" && a.user.id === Number(seller.chatId)
    );

    if (owner) {
      return res.json({
        verified: true,
        message: "✅ Ownership verified — user is group creator."
      });
    } else {
      return res.json({
        verified: false,
        message: "❌ Ownership not verified — user is NOT the group owner."
      });
    }
  } catch (err) {
    console.error("Verification error:", err.message);
    res.status(500).json({
      message: "Verification failed. Ensure bot is added as admin.",
      error: err.message
    });
  }
};

/* -------------------------------------------
   NOT USED IN FRONTEND BUT EXPORT FOR ROUTER
--------------------------------------------- */

export const getChatId = async () => {};
