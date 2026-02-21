import mongoose from "mongoose";
import User from "../model/user.model/reward/user.js";
import CoinTransaction from "../model/user.model/reward/CoinTransaction.js";

export async function rewardUser({
  userId,
  amount,
  source,
  referenceId,
  metadata = {},
}) {
  const session = await mongoose.startSession();

  await session.withTransaction(async () => {
    await CoinTransaction.create(
      [
        {
          user: userId,
          type: "earn",
          source,
          amount,
          referenceId,
          metadata,
        },
      ],
      { session }
    );

    await User.updateOne(
      { _id: userId },
      { $inc: { coins: amount } },
      { session }
    );
  });

  session.endSession();
}