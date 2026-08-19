import express from "express";
import {
  createEqubChallenge,
  getActiveChallenges,
  getBillingProducts,
  getEqubChallengeById,
  initializeEqubPayment,
  joinEqubChallenge,
  verifyEqubPayment,
} from "../controllers/equb.controller.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/active", getActiveChallenges);
router.get("/billing-products", protect, getBillingProducts);
router.post("/create", protect, createEqubChallenge);
router.post("/payment/initialize", protect, initializeEqubPayment);
router.post("/payment/verify", protect, verifyEqubPayment);
router.post("/join", protect, joinEqubChallenge);
router.get("/:challengeId", getEqubChallengeById);

export default router;
