import express from "express";
import { loginTelegramMiniAppUser } from "../../utils/telegramAuth.js";

const router = express.Router();

router.post("/telegram-login", loginTelegramMiniAppUser);

export default router;
