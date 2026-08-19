import express from "express";
import { chapaWebhook, initializePayment, verifyPaymentStatus } from "../../controller/payments/chapaPayment.controller.js";

const router = express.Router();

router.post("/initialize", initializePayment);
router.post("/webhook", chapaWebhook);
router.get("/verify/:txRef", verifyPaymentStatus);

export default router;
