import express from "express";
import mongoose from "mongoose";
import Order from "../../model/Order/Order.js";

const router = express.Router();

router.get("/seller/:sellerId", async (req, res) => {
  try {
    const { sellerId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(sellerId)) {
      return res.status(400).json({ message: "Invalid seller id." });
    }

    const orders = await Order.find({ sellerId, status: "paid" })
      .populate("product")
      .populate("buyerId", "name email")
      .sort({ createdAt: -1 })
      .lean();

    return res.json(orders);
  } catch (error) {
    console.error("Failed to fetch seller orders:", error);
    return res.status(500).json({ message: "Failed to fetch seller orders." });
  }
});

export default router;
