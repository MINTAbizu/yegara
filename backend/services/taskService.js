import Task from "../model/user.model/reward/Task.js";
import UserTask from "../model/user.model/reward/UserTask.js";
import { rewardUser } from "../services/rewardService.js";

export async function completeTask(userId, taskType) {
  const task = await Task.findOne({
    type: taskType,
    isActive: true,
  });

  if (!task) throw new Error("Task unavailable");

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const count = await UserTask.countDocuments({
    user: userId,
    task: task._id,
    completedAt: { $gte: today },
  });

  if (count >= task.dailyLimit)
    throw new Error("Daily limit reached");

  await UserTask.create({
    user: userId,
    task: task._id,
  });

  await rewardUser({
    userId,
    amount: task.reward,
    source: "task",
    referenceId: task._id,
  });

  return { reward: task.reward };
}