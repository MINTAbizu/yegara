import express from "express";
import {protect} from "../../middleware/authMiddleware.js";
import { generateReferralLink } from "../../controller/reward/referralController.js";

const router = express.Router();

router.post("/link", protect, generateReferralLink);

export default router;