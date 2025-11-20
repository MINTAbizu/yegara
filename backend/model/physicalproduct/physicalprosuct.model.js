import mongoose from "mongoose";

const physicalProductSchema = new mongoose.Schema({
  productName: String,
  price: Number,
  description: String,
  image: String,
  sellerId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  status: { type: String, enum: ["pending", "approved", "rejected"], default: "pending" },
}, { timestamps: true });

export default mongoose.model("PhysicalProduct", physicalProductSchema);
