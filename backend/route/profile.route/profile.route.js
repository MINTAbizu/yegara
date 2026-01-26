import express from "express";
import { createProfile,ouruser, getAllProfiles, updateProfileStatus, getApprovedProfiles } from "../../controller/profilecontroller/profile.controller.js";
import { protect } from "../../middleware/authMiddleware.js";
import multer from "multer";

const router = express.Router();

// Multer memory storage
const storage = multer.memoryStorage();
const upload = multer({ storage });

// User submit profile
router.post("/create", protect, upload.fields([
  { name: "avatar", maxCount: 1 },
  { name: "backgroundImage", maxCount: 1 },
]), createProfile);

// Admin: get all profiles
router.get("/", protect, getAllProfiles);

// Admin: approve/reject profile
router.patch("/:id/status", protect, updateProfileStatus);
router.get("/ourusers", ouruser);
// Public: get all approved profiles
router.get("/approved", getApprovedProfiles);

export default router;
