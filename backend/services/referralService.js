import User from "../model/user.model/reward/user.js";
import { rewardUser } from "./rewardService.js";
import referralConfig from "../config/reward/referralConfig.js";

/**
 * Apply referral during registration
 */
export async function applyReferral(newUserId, referralCode) {
  if (!referralCode) return;

  const referrer = await User.findOne({ referralCode });

  if (!referrer) return;

  // ❌ Prevent self referral
  if (referrer._id.toString() === newUserId.toString()) return;

  // Save who referred this user
  await User.findByIdAndUpdate(newUserId, {
    referredBy: referrer._id,
  });
}

/**
 * Reward referral after first purchase
 */
export async function processReferralReward(userId, orderAmount, orderId) {
  const user = await User.findById(userId);

  if (!user.referredBy) return;

  // Minimum purchase check
  if (orderAmount < referralConfig.minimumPurchase) return;

  const referrer = await User.findById(user.referredBy);

  if (!referrer) return;

  // Reward referrer
  await rewardUser({
    userId: referrer._id,
    amount: referralConfig.referrerReward,
    source: "referral",
    referenceId: orderId,
  });

  // Reward new user
  await rewardUser({
    userId: user._id,
    amount: referralConfig.refereeReward,
    source: "referral",
    referenceId: orderId,
  });
}