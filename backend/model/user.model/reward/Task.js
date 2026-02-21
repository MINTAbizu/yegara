import mongoose from "mongoose";

const taskSchema = new mongoose.Schema({
  name: { type: String, required: true },

  type: {
    type: String,
    enum: ["daily_login", "share", "invite","review"],
    required: true,
  },

  reward: { type: Number, required: true },

  dailyLimit: { type: Number, default: 1 },

  isActive: { type: Boolean, default: true },
});

export default mongoose.model("Task", taskSchema);