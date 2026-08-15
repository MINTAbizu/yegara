import express from "express";
import { createEqubChallenge, joinEqubChallenge } from "../controllers/equb.controller.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/create", protect, createEqubChallenge);
router.post("/join", protect, joinEqubChallenge);

export default router;
