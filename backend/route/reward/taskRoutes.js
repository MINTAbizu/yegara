import express from "express";
import { completeTaskController } from "../../controller/reward/taskController.js";
import {protect} from "../../middleware/authMiddleware.js";

const router = express.Router();

router.post("/complete", protect, completeTaskController);

export default router;