import mongoose from "mongoose";

const telegramUserSchema = new mongoose.Schema({
  username: { type: String, unique: true, required: true },
  chatId: { type: String, required: true }
});

export default mongoose.model("TelegramUser", telegramUserSchema);
