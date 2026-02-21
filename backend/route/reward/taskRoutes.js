import express from "express";
import { completeTaskController } from "../../controller/reward/taskController.js";
import auth from "../../middleware/authMiddleware.js";

const router = express.Router();

router.post("/complete", auth, completeTaskController);

export default router;