import crypto from "crypto";
import mongoose from "mongoose";
import EqubChallenge from "../models/EqubChallenge.model.js";
import Coupon from "../models/Coupon.model.js";

const COUPON_PREFIX = "YGR";

export const generateCouponCode = () => {
  const randomPart = crypto.randomBytes(6).toString("hex").toUpperCase();
  return `${COUPON_PREFIX}-${randomPart}`;
};

export const triggerEqubRefund = async (challengeId) => {
  // Replace this placeholder with your external payment gateway refund integration.
  console.log(`[Equb Refund] Refund process triggered for challenge ${challengeId}`);
  return { ok: true, challengeId };
};

export const settleExpiredEqubChallenges = async () => {
  const now = new Date();

  const pendingChallenges = await EqubChallenge.find({
    status: "PENDING",
  }).lean();

  for (const challenge of pendingChallenges) {
    const isExpired = new Date(challenge.expiresAt) <= now;
    const isFullyFilled = challenge.filledSlots.length >= challenge.totalSlots;

    if (!isExpired && !isFullyFilled) {
      continue;
    }

    const session = await mongoose.startSession();

    try {
      await session.withTransaction(async () => {
        const latestChallenge = await EqubChallenge.findById(challenge._id).session(session);

        if (!latestChallenge || latestChallenge.status !== "PENDING") {
          return;
        }

        const filledUserIds = latestChallenge.filledSlots.map((userId) => userId.toString());

        if (filledUserIds.length >= latestChallenge.totalSlots) {
          const winnerId = filledUserIds[crypto.randomInt(0, filledUserIds.length)];

          latestChallenge.status = "SUCCESS";
          latestChallenge.winnerId = winnerId;
          await latestChallenge.save({ session });

          const losers = filledUserIds.filter((userId) => userId !== winnerId);

          if (losers.length > 0) {
            const couponDocs = losers.map((userId) => ({
              code: generateCouponCode(),
              value: 1000,
              userId,
              minOrderAmount: 2000,
              isUsed: false,
              expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
              challengeId: latestChallenge._id,
            }));

            await Coupon.insertMany(couponDocs, { session, ordered: false });
          }

          return;
        }

        latestChallenge.status = "FAILED";
        await latestChallenge.save({ session });
        await triggerEqubRefund(latestChallenge._id);
      });
    } catch (error) {
      console.error("Error settling Equb challenge:", error);
    } finally {
      await session.endSession();
    }
  }
};

export const startEqubSettlementService = (intervalMs = 60000) => {
  if (globalThis.__equbSettlementTimer) {
    return globalThis.__equbSettlementTimer;
  }

  globalThis.__equbSettlementTimer = setInterval(() => {
    settleExpiredEqubChallenges().catch((error) => {
      console.error("Equb settlement job failed:", error);
    });
  }, intervalMs);

  return globalThis.__equbSettlementTimer;
};
