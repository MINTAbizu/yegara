import express from "express";
import {protect} from "../../middleware/authMiddleware.js";
import { getWallet } from "../../controller/reward/walletController.js";

const router = express.Router();

router.get("/", protect, getWallet);

export default router;