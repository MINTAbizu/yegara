import mongoose from "mongoose";

const badgeSchema = new mongoose.Schema({
  name: String,
  icon: String,
  color: String,
  givenBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  givenAt: {
    type: Date,
    default: Date.now,
  },
});

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true },
    password: { type: String, required: true },

    badges: [badgeSchema],

    role: {
      type: String,
      enum: ["seller", "buyer", "pro", "admin"],
      default: "buyer",
    },

    chapaWallet: String,

    // ✅ Coin system fields
    coins: { type: Number, default: 0 },
    referralCode: { type: String, unique: true, sparse: true },
    referredBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  { timestamps: true }
);

export default mongoose.model("User", userSchema);