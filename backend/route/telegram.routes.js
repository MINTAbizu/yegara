// backend/routes/telegram.routes.js
import express from "express";
import {
  sendVerificationCode,
  getChatId,
  verifyGroupOwner,
} from "../controller/telegram.controller.js";

const router = express.Router();

router.post("/send-code", sendVerificationCode);
router.post("/get-chat-id", getChatId);
router.post("/verify-owner", verifyGroupOwner);

export default router;
