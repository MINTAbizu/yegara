import mongoose from "mongoose";

const digitalProductSchema = new mongoose.Schema({
  productName: String,
  price: Number,
  description: String,
  image: String,
  telegram: String,
  drive: String,
  dropbox: String,

    // ⭐ RATING SYSTEM
  ratings: [
    {
      user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
      },
      value: {
        type: Number,
        required: true,
        min: 1,
        max: 5
      }
    }
  ],

  averageRating: {
    type: Number,
    default: 0
  },

  productLink: String,
   seller: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
 
  status: { type: String, enum: ["pending", "approved", "rejected"], default: "pending" },
}, { timestamps: true });

export default mongoose.model("DigitalProduct", digitalProductSchema);
