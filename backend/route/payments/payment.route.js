// import express from "express";
// import { createOrder, chapaWebhook } from "../controllers/payment.controller.js";
// const router = express.Router();
// router.post("/create-order", createOrder);
// router.post("/webhook", chapaWebhook);
// export default router;
import express from "express";
import {  verifyChapaPayment,initiateChapaSplitPayment,initiatePayment } from "../../controller/payment/payment.controller.js";
const router = express.Router();

// Initialize payment

router.post("/initiate", initiatePayment);
// router.post("/chapa", initiateChapaPayment);
router.post("/chapa/split", initiateChapaSplitPayment);
// Verify payment
router.get("/verify/:tx_ref", verifyChapaPayment);

export default router;
