import mongoose from "mongoose";

const equbChallengeSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
      maxlength: 120,
    },
    description: {
      type: String,
      required: true,
      trim: true,
      maxlength: 2000,
    },
    fundingType: {
      type: String,
      enum: ["FLEXIBLE", "PRODUCT_LOCKED"],
      default: "FLEXIBLE",
      index: true,
    },
    productId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "PhysicalProduct",
      default: null,
      index: true,
    },
    productSnapshot: {
      name: { type: String, trim: true, default: null },
      price: { type: Number, min: 0, default: null },
      image: { type: String, trim: true, default: null },
    },
    creatorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    vendorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
      index: true,
    },
    slotPrice: {
      type: Number,
      required: true,
      min: 1,
    },
    totalSlots: {
      type: Number,
      required: true,
      min: 1,
    },
    filledSlots: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    expiresAt: {
      type: Date,
      required: true,
      index: true,
    },
    status: {
      type: String,
      enum: ["PENDING", "SUCCESS", "FAILED"],
      default: "PENDING",
      index: true,
    },
    winnerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
      index: true,
    },
    winnerRedemption: {
      type: {
        type: String,
        enum: ["MARKETPLACE_CREDIT", "PRODUCT_CHECKOUT"],
        default: "MARKETPLACE_CREDIT",
      },
      amount: { type: Number, min: 0, default: 0 },
      productId: { type: mongoose.Schema.Types.ObjectId, ref: "PhysicalProduct", default: null },
      status: {
        type: String,
        enum: ["NOT_READY", "READY", "CLAIMED", "EXPIRED"],
        default: "NOT_READY",
      },
      readyAt: { type: Date, default: null },
    },
    paymentRef: {
      type: String,
      default: null,
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

const EqubChallenge = mongoose.model("EqubChallenge", equbChallengeSchema);

export default EqubChallenge;
