// seedTasks.js
import mongoose from "mongoose";
import dotenv from "dotenv";
import Task from "./reward/Task";

dotenv.config();

mongoose.connect(process.env.MONGO_URI);

const tasks = [
  { type: "share", title: "Share a Product", reward: 20, dailyLimit: 1, isActive: true },
  { type: "review", title: "Write a Product Review", reward: 10, dailyLimit: 1, isActive: true },
  { type: "purchase", title: "Complete First Purchase", reward: 50, dailyLimit: 1, isActive: true },
  { type: "daily_login", title: "Daily Login", reward: 5, dailyLimit: 1, isActive: true },
];

Task.insertMany(tasks)
  .then(() => {
    console.log("Tasks seeded!");
    mongoose.disconnect();
  })
  .catch((err) => console.error(err));