import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
  productName: { type: String, required: true },
  price: { type: Number, required: true },
  description: String,
  image: String,
  telegram: String,
  drive: String,
  dropbox: String,
  productLink: String,

  type: { type: String, enum: ["digital", "physical"], required: true },

  location: { // optional for digital, required for physical
    type: { type: String, enum: ["Point"], default: "Point" },
    coordinates: { type: [Number], default: [0, 0] }, // [lng, lat]
  },

  seller: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },

  ratings: [
    {
      user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
      value: { type: Number, required: true, min: 1, max: 5 },
    },
  ],
  averageRating: { type: Number, default: 0 },

  status: { type: String, enum: ["pending", "approved", "rejected"], default: "pending" },

}, { timestamps: true });

// geospatial index for physical products
productSchema.index({ location: "2dsphere" });

export default mongoose.model("Product", productSchema);
