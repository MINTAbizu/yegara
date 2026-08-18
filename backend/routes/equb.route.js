import express from "express";
import {
  createEqubChallenge,
  getActiveChallenges,
  getEqubChallengeById,
  joinEqubChallenge,
} from "../controllers/equb.controller.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/active", getActiveChallenges);
router.get("/:challengeId", getEqubChallengeById);
router.post("/create", protect, createEqubChallenge);
router.post("/join", protect, joinEqubChallenge);

export default router;
