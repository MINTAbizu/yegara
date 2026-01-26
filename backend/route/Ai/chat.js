import express from "express";
import { askAI } from "../Ai/services/ai.js";

const router = express.Router();

router.post("/", async (req, res) => {
  try {
    const { message } = req.body;
    const reply = await askAI(message);
    res.json({ reply });
  } catch (err) {
    res.status(500).json({
      reply: "Server error. Please contact human support."
    });
  }
});

export default router;
