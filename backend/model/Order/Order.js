// import mongoose from "mongoose";

// const orderSchema = new mongoose.Schema(
//   {
//     buyerId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
//     buyerEmail: String,
//     sellerId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
//     productId: { type: mongoose.Schema.Types.ObjectId, refPath: "productType" },
//     productType: { type: String, enum: ["DigitalProduct", "physicalproduct"] },
//     price: Number,
//     status: { type: String, enum: ["pending", "paid"], default: "pending" },
//     downloadLink: String,
//     tx_ref: String
//   },
//   { timestamps: true }
// );

// export default mongoose.model("Order", orderSchema);

import mongoose from "mongoose";

const orderSchema = new mongoose.Schema({
  product: { type: mongoose.Schema.Types.ObjectId, ref: "DigitalProduct", required: true },
  buyerEmail: { type: String, required: true },
  amount: { type: Number, required: true },
  status: { type: String, enum: ["pending", "paid"], default: "pending" },
  tx_ref: { type: String, required: true },
}, { timestamps: true });

export default mongoose.model("Order", orderSchema);
