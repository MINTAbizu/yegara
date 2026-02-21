import mongoose from "mongoose";

const referralSchema = new mongoose.Schema({
  referrer: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  referee: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  orderId: { type: String },                      // track when reward applies
  rewardGiven: { type: Boolean, default: false },
}, { timestamps: true });

export default mongoose.model("Referral", referralSchema);