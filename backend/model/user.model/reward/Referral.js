import mongoose from "mongoose";

const referralSchema = new mongoose.Schema({
  referrer: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  referred: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  code: String, 
  milestone: { type: String, enum: ["signup","first_purchase"] },
  rewardGiven: { type: Boolean, default: false },
  status: { type: String, enum: ["pending","completed"], default: "pending" },
}, { timestamps: true });

export default mongoose.model("Referral", referralSchema);