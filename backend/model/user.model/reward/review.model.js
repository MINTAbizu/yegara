// models/reward/review.model.js
import mongoose from "mongoose";

const reviewSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  task: { type: mongoose.Schema.Types.ObjectId, ref: "Task", required: true },
  text: { type: String, required: true },
  submittedAt: { type: Date, default: Date.now },
});

export default mongoose.model("Review", reviewSchema);