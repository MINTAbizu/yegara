import mongoose from "mongoose";

const couponSchema = new mongoose.Schema(
  {
    code: {
      type: String,
      required: true,
      unique: true,
      uppercase: true,
      trim: true,
    },
    value: {
      type: Number,
      required: true,
      default: 1000,
      min: 1,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    minOrderAmount: {
      type: Number,
      required: true,
      default: 2000,
      min: 1,
    },
    isUsed: {
      type: Boolean,
      default: false,
    },
    expiresAt: {
      type: Date,
      required: true,
      index: true,
    },
    challengeId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "EqubChallenge",
      default: null,
      index: true,
    },
  },
  {
    timestamps: true,
  }
);

const Coupon = mongoose.model("Coupon", couponSchema);

export default Coupon;
