import express from "express";
import auth from "../../middleware/authMiddleware.js";
import { generateReferralLink } from "../../controller/reward/referralController.js";

const router = express.Router();

router.post("/link", auth, generateReferralLink);

export default router;