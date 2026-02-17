const productSchema = new mongoose.Schema({
  productName: { type: String, required: true },
  price: { type: Number, required: true },
  description: String,
  image: String,
  telegram: String,
  drive: String,
  dropbox: String,
  productLink: String,

  location: {
    type: { type: String, enum: ["Point"], default: "Point" },
    coordinates: { type: [Number], default: [0, 0] },
  },

  // ⭐ ADD THIS
  locationName: String,

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

  status: {
    type: String,
    enum: ["pending", "approved", "rejected"],
    default: "pending",
  },

}, { timestamps: true });
