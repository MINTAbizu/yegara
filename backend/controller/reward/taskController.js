import { completeTask } from "../../services/taskService.js";

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