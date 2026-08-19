import mongoose from "mongoose";

const orderSchema = new mongoose.Schema({
  product: { type: mongoose.Schema.Types.ObjectId, refPath: "productModel", required: true },
  productModel: { type: String, enum: ["DigitalProduct", "Product", "PhysicalProduct", "giftproduct"], default: "DigitalProduct" },
  productType: { type: String, enum: ["book", "digital", "physical", "gift"], default: "digital" },
  buyerId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  buyerEmail: { type: String, required: true },
  sellerId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  amount: { type: Number, required: true },
  status: { type: String, enum: ["pending", "paid"], default: "pending" },
  tx_ref: { type: String, required: true, unique: true },
}, { timestamps: true });

export default mongoose.model("Order", orderSchema);
