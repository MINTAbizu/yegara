const mongoose = require("mongoose");

const eventSchema = new mongoose.Schema({
  userId: { type: String, required: true ,ref: 'User'},
  productId: {String, ref: 'Product'},
  action: { type: String, required: true, enum: ["view", "click", "purchase"] },
  metadata: Object,
  timestamp: { type: Date, default: Date.now },
});

module.exports = mongoose.model("UserEvent", eventSchema);
