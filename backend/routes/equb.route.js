import express from "express";
import { createEqubChallenge, joinEqubChallenge, getActiveChallenges } from "../controllers/equb.controller.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/active", getActiveChallenges);
router.post("/create", protect, createEqubChallenge);
router.post("/join", protect, joinEqubChallenge);

export default router;
