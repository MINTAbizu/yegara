import mongoose from("mongoose");

const schema = new mongoose.Schema({
  productId: String,
  popularityScore: Number,
  purchaseCount: Number,
  viewCount: Number,
  lastUpdated: Date,
});

module.exports = mongoose.model("ProductFeature", schema);
