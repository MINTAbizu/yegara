import express from "express";
import Order from "../../model/order.model.js";
import path from "path";
import fs from "fs";

const router = express.Router();

router.get("/download/:orderId", async (req, res) => {
  try {
    const order = await Order.findById(req.params.orderId).populate("productId");
    if (!order) return res.status(404).json({ message: "Order not found" });
    if (order.status !== "paid") return res.status(403).json({ message: "Payment required" });

    const filePath = path.join(process.cwd(), "uploads", order.productId.file); // digital product file path
    if (!fs.existsSync(filePath)) return res.status(404).json({ message: "File not found" });

    res.download(filePath, order.productId.productName);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error", error: err });
  }
});

export default router;
