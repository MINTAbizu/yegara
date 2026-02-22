import mongoose from "mongoose";

const walletTransactionSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  type: { type: String, enum: ["earn","spend"], required: true },
  source: { type: String, enum: ["referral","task","purchase"], required: true },
  amount: { type: Number, required: true },
  referenceId: mongoose.Schema.Types.ObjectId,
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.model("WalletTransaction", walletTransactionSchema);