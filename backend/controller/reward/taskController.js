import { completeTask } from "../../services/taskService.js";
import Task from "../../model/user.model/reward/Task.js"; // Task schema
import user from "../../model/user.model/user.model.js";

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
    res.json({ tasks });
  } catch (err) {
    console.error("getTasks error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// Complete a task
export const completeTaskController = async (req, res) => {
  try {
    const user = req.user;
    const { taskType } = req.body;

    const task = await Task.findOne({ type: taskType });
    if (!task) return res.status(404).json({ message: "Task not found" });

    // check daily limit
    const completedToday = await UserTask.countDocuments({
      user: user._id,
      task: task._id,
      completedAt: { $gte: new Date(new Date().setHours(0,0,0,0)) },
    });

    if (completedToday >= task.dailyLimit) {
      return res.status(400).json({ message: "Daily limit reached" });
    }

    // record completion
    await UserTask.create({ user: user._id, task: task._id });

    // update user's coins
    user.coins = (user.coins || 0) + task.reward;
    await user.save();

    res.json({ message: "Task completed", coins: user.coins });
  } catch (err) {
    console.error("completeTaskController error:", err);
    res.status(500).json({ message: "Server error" });
  }
};