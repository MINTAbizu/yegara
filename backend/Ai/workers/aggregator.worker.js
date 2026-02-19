require("dotenv").config();
const mongoose = require("mongoose");

const {
  aggregateUserFeatures,
} = require("../services/userFeatures.service");

const {
  aggregateProductFeatures,
} = require("../services/productFeatures.service");

mongoose.connect(process.env.MONGO_URI);

async function runAggregation() {
  console.log("Starting feature aggregation...");

  await aggregateUserFeatures();
  await aggregateProductFeatures();

  console.log("Aggregation complete");
}

runAggregation();
