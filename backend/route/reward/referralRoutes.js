import express from "express";
import { protect } from "../../middleware/authMiddleware.js";
import { generateReferralLink, resolveReferralCode } from "../../controller/reward/referralController.js";

const router = express.Router();

router.post("/link", protect, generateReferralLink);
router.get("/:code", resolveReferralCode);

export default router;
