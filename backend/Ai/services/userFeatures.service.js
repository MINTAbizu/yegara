import Event from("../../event-model"); // shared DB model
import UserFeature from("../models/userFeature.model");

exports.aggregateUserFeatures = async () => {
  const pipeline = [
    {
      $group: {
        _id: "$userId",
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

  for (const user of results) {
    await UserFeature.findOneAndUpdate(
      { userId: user._id },
      {
        purchaseFrequency: user.purchases,
        lastUpdated: new Date(),
      },
      { upsert: true }
    );
  }
};
