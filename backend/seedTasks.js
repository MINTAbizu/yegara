import mongoose from "mongoose";
import dotenv from "dotenv";
// import Task from "./model/reward/task.model.js";
import Task from "../backend/model/user.model/reward/Task.js";


dotenv.config();

const seedTasks = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);

    console.log("Connected to DB");

    // optional reset
    await Task.deleteMany();

    await Task.insertMany([
      {
        name: "Share a Product",
        type: "share",
        reward: 20,
        dailyLimit: 1,
        isActive: true,
      },
      {
        name: "Write a Review",
        type: "review",
        reward: 10,
        dailyLimit: 1,
        isActive: true,
      },
      {
        name: "Daily Login",
        type: "daily_login",
        reward: 5,
        dailyLimit: 1,
        isActive: true,
      },
    ]);

    console.log("✅ Tasks seeded successfully!");
    process.exit();
  } catch (err) {
    console.error("Seed error:", err);
    process.exit(1);
  }
};

seedTasks();