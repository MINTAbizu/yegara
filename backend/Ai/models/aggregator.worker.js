import mongoose from("mongoose");

const schema = new mongoose.Schema({
  userId: String,
  favoriteCategories: [String],
  purchaseFrequency: Number,
  avgSpend: Number,
  lastUpdated: Date,
});

module.exports = mongoose.model("UserFeature", schema);
