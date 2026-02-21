import express from "express";
import { completeTaskController,getTasks } from "../../controller/reward/taskController.js";
import {protect} from "../../middleware/authMiddleware.js";

const router = express.Router();

// router.post("/complete", protect, completeTaskController);
// routes/taskRoutes.js
router.get("/tasks", protect, getTasks);          // fetch all tasks
router.post("/tasks/complete", protect, completeTaskController); // complete task
export default router;