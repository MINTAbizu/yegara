import mongoose from "mongoose";

const userTaskSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  task: { type: mongoose.Schema.Types.ObjectId, ref: "Task" },
  completedAt: { type: Date, default: Date.now },
});

userTaskSchema.index({ user: 1, task: 1, completedAt: 1 });

export default mongoose.model("UserTask", userTaskSchema);