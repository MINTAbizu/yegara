const Event = require("../../event-model");
const ProductFeature = require("../models/productFeature.model");

exports.aggregateProductFeatures = async () => {
  const pipeline = [
    {
      $match: { productId: { $exists: true } },
    },
    {
      $group: {
        _id: "$productId",
        purchases: {
          $sum: { $cond: [{ $eq: ["$action", "purchase"] }, 1, 0] },
        },
        views: {
          $sum: { $cond: [{ $eq: ["$action", "view"] }, 1, 0] },
        },
      },
    },
  ];

  const results = await Event.aggregate(pipeline);

  for (const product of results) {
    const popularity = product.purchases * 3 + product.views;

    await ProductFeature.findOneAndUpdate(
      { productId: product._id },
      {
        purchaseCount: product.purchases,
        viewCount: product.views,
        popularityScore: popularity,
        lastUpdated: new Date(),
      },
      { upsert: true }
    );
  }
};
