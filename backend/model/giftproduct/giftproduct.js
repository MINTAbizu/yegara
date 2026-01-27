import mongoose from "mongoose";

const giftproduct = new mongoose.Schema({
  productName: String,
  price: Number,
  description: String,
  image: String,
  telegram: String,
  drive: String,
  dropbox: String,
  productLink: String,
   seller: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
 
  status: { type: String, enum: ["pending", "approved", "rejected"], default: "pending" },
}, { timestamps: true });

export default mongoose.model("giftproduct", giftproduct);
