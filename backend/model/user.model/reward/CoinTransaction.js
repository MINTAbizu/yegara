import mongoose from "mongoose";

const coinTransactionSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },

  type: {
    type: String,
    enum: ["earn", "spend"],
    required: true,
  },

  source: {
    type: String,
    enum: ["task", "referral", "purchase", "admin"],
    required: true,
  },

  amount: { type: Number, required: true },

  referenceId: String,

  metadata: Object,

  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.model(
  "CoinTransaction",
  coinTransactionSchema
);