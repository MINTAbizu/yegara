import { completeTask } from "../../services/taskService.js";
import Task from "../../model/reward/task.model.js"; // Task schema
import user from "../../model/user.model/user.model.js";

export async function completeTaskController(req, res) {
  try {
    const result = await completeTask(
      req.user.id,
      req.body.taskType
    );

    res.json({
      success: true,
      coinsEarned: result.reward,
    });
  } catch (err) {
    res.status(400).json({
      success: false,
      message: err.message,
    });
  }
}



/**
 * Get all active tasks for the logged-in user
 * Returns user progress on each task
 */
export const getTasks = async (req, res) => {
  try {
    const user = req.user; // set by auth middleware
    if (!user) return res.status(401).json({ message: "Unauthorized" });

    // Get all active tasks
    const tasks = await Task.find({ isActive: true });

    // Map user progress
    const tasksWithProgress = tasks.map((task) => {
      const progressEntry = user.tasks?.find((t) => t.task.toString() === task._id.toString());
      return {
        _id: task._id,
        title: task.title,
        type: task.type,
        reward: task.reward,
        dailyLimit: task.dailyLimit,
        isActive: task.isActive,
        progress: progressEntry?.progress || 0,
        status: progressEntry?.completed ? "Completed" : progressEntry ? "In Progress" : "Pending",
      };
    });

    res.status(200).json({ tasks: tasksWithProgress });
  } catch (err) {
    console.error("getTasks error:", err);
    res.status(500).json({ message: "Server error" });
  }
};