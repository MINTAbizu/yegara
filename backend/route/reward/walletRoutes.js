import express from "express";
import auth from "../../middleware/authMiddleware.js";
import { getWallet } from "../../controller/reward/walletController.js";

const router = express.Router();

router.get("/", auth, getWallet);

export default router;