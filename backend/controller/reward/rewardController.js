// controllers/rewardController.js
import User from "../models/User.js";
import Referral from "../models/Referral.js";
import WalletTransaction from "../models/WalletTransaction.js";

const milestoneRewardValue = {
  signup: 10,
  first_purchase: 50
};

export const checkMilestoneReward = async (userId, milestone) => {
  const user = await User.findById(userId);
  if (user.milestonesCompleted.includes(milestone)) return;

  user.milestonesCompleted.push(milestone);
  await user.save();

  if (!user.referredBy) return;

  const referrer = await User.findById(user.referredBy);
  const referral = await Referral.findOne({ referrer: referrer._id, referred: user._id, milestone });

  if (!referral.rewardGiven) {
    const reward = milestoneRewardValue[milestone];
    referrer.wallet.coins += reward;
    await referrer.save();

    referral.rewardGiven = true;
    referral.status = "completed";
    await referral.save();

    await WalletTransaction.create({
      user: referrer._id,
      type: "earn",
      source: "referral",
      amount: reward,
      referenceId: referral._id,
    });
  }
};