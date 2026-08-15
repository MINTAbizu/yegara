// import mongoose from 'mongoose';

// const userSchema = new mongoose.Schema({
//     name: {
//         type: String,
//         required: true,
//         trim: true
//     },
//     email: {
//         type: String,
//         required: true,
//         unique: true,
//         lowercase: true
//     },
//     password: {
//         type: String,
//         required: true
//     },

//     badges: [
//   {
//     name: { type: String },     // "Verified Seller"
//     icon: { type: String },     // "✔️"
//     color: { type: String },    // "bg-green-100 text-green-700"
//     givenBy: {
//       type: mongoose.Schema.Types.ObjectId,
//       ref: "User",              // admin id
//     },
//     givenAt: {
//       type: Date,
//       default: Date.now,
//     },
//   },
// ],

//      role: { type: String, enum: ["seller", "buyer", "pro", "admin"], default: "buyer" },
//   // Add this field:
//   chapaWallet: { type: String }
// }, { timestamps: true });

// const User = mongoose.model('User', userSchema);

// export default User;


import mongoose from "mongoose";
import { nanoid } from "nanoid";

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true },
    password: { type: String, required: true },
   referralCode: { type: String, unique: true, default: () => nanoid(8) },
  referredBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  wallet: { coins: { type: Number, default: 0 } },
  milestonesCompleted: [{ type: String }],
    badges: [
      {
        name: String,
        icon: String,
        color: String,
        givenBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
        givenAt: { type: Date, default: Date.now },
      },
    ],

    role: { type: String, enum: ["seller", "buyer", "pro", "admin"], default: "buyer" },

    // KYC verification status (persistent - once verified, always verified)
    kycSubmitted: { type: Boolean, default: false, index: true },

    // Coins for rewards
    coins: { type: Number, default: 0 },

    // Referral
    referralCode: { type: String, default: () => nanoid(8), unique: true },
    referredBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },

    // Wallet integration
    chapaWallet: { type: String },

    // Pro account
    proSince: { type: Date },
  },
  { timestamps: true }
);

const User = mongoose.model("User", userSchema);
export default User;