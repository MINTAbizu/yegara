import mongoose from "mongoose";
import EqubChallenge from "../models/EqubChallenge.model.js";

export const joinEqubChallenge = async (req, res) => {
  const userId = req.user?._id || req.user?.id;
  const { challengeId, paymentRef } = req.body;

  if (!challengeId) {
    return res.status(400).json({ message: "challengeId is required." });
  }

  if (!userId) {
    return res.status(401).json({ message: "Authentication required." });
  }

  const session = await mongoose.startSession();

  try {
    let challenge;

    await session.withTransaction(async () => {
      challenge = await EqubChallenge.findOne({
        _id: challengeId,
        status: "PENDING",
        expiresAt: { $gt: new Date() },
      }).session(session);

      if (!challenge) {
        throw Object.assign(new Error("This challenge is no longer active or was not found."), {
          status: 400,
        });
      }

      const participantIds = challenge.filledSlots.map((id) => id.toString());

      if (participantIds.includes(userId.toString())) {
        throw Object.assign(new Error("You already joined this challenge."), {
          status: 409,
        });
      }

      if (challenge.filledSlots.length >= challenge.totalSlots) {
        throw Object.assign(new Error("This challenge has no remaining slots."), {
          status: 409,
        });
      }

      challenge.filledSlots.push(userId);
      challenge.paymentRef = paymentRef || challenge.paymentRef;
      await challenge.save({ session });
    });

    return res.status(200).json({
      message: "Slot reserved successfully.",
      challenge,
      remainingSlots: challenge.totalSlots - challenge.filledSlots.length,
    });
  } catch (error) {
    const statusCode = error?.status || 500;
    return res.status(statusCode).json({
      message: error?.message || "Unable to process Equb slot reservation.",
    });
  } finally {
    await session.endSession();
  }
};
