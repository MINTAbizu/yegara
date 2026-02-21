import { completeTask } from "../../services/taskService.js";
import UserTask from "../../model/user.model/reward/UserTask.js"; // ✅ THIS WAS MISSING

import Task from "../../model/user.model/reward/Task.js"; // Task schema
import User from "../../model/user.model/user.model.js";

// export async function completeTaskController(req, res) {
//   try {
//     const result = await completeTask(
//       req.user.id,
//       req.body.taskType
//     );

//     res.json({
//       success: true,
//       coinsEarned: result.reward,
//     });
//   } catch (err) {
//     res.status(400).json({
//       success: false,
//       message: err.message,
//     });
//   }
// }



/**
 * Get all active tasks for the logged-in user
 * Returns user progress on each task
 */
// export const getTasks = async (req, res) => {

//   try {
//     const user = req.user; // set by auth middleware
//     if (!user) return res.status(401).json({ message: "Unauthorized" });

//     // Get all active tasks
//     const tasks = await Task.find({ isActive: true });

//     // Map user progress
//     const tasksWithProgress = tasks.map((task) => {
//       const progressEntry = user.tasks?.find((t) => t.task.toString() === task._id.toString());
//       return {
//         _id: task._id,
//         title: task.title,
//         type: task.type,
//         reward: task.reward,
//         dailyLimit: task.dailyLimit,
//         isActive: task.isActive,
//         progress: progressEntry?.progress || 0,
//         status: progressEntry?.completed ? "Completed" : progressEntry ? "In Progress" : "Pending",
//       };
//     });

//     res.status(200).json({ tasks: tasksWithProgress });
//   } catch (err) {
//     console.error("getTasks error:", err);
//     res.status(500).json({ message: "Server error" });
//   }
// };





// import Task from "../../model/reward/Task.js";
// import UserTask from "../../model/reward/UserTask.js";

// Get all active tasks


export const getTasks = async (req, res) => {
  try {
    const tasks = await Task.find({ isActive: true });
    res.json(tasks); // return array directly
  } catch (err) {
    console.error("getTasks error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// Complete a task
// completeTaskController
export const completeTaskController = async (req, res) => {
  try {
    const { taskType } = req.body;
    const userId = req.user._id;

    if (!taskType) {
      return res.status(400).json({ message: "taskType is required" });
    }

    // Find task
    const task = await Task.findOne({ type: taskType, isActive: true });
    if (!task) {
      return res.status(404).json({ message: "Task not found or inactive" });
    }

    // Check daily limit
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const completedToday = await UserTask.countDocuments({
      user: userId,
      task: task._id,
      completedAt: { $gte: today },
    });

    if (completedToday >= task.dailyLimit) {
      return res.status(400).json({ message: "You have already completed this task today" });
    }

    // Record task completion
    const userTask = new UserTask({ user: userId, task: task._id });
    await userTask.save();

    // Update user coins
    const user = await User.findById(userId);
    user.coins += task.reward;
    await user.save();

    res.json({ message: "Task completed", reward: task.reward, coins: user.coins });
  } catch (err) {
    console.error("completeTaskController error:", err);
    res.status(500).json({ message: "Server error" });
  }
};