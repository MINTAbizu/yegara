import express from "express";
import {
  createProfile,
  ouruser,
  getAllProfiles,
  updateProfileStatus,
  getApprovedProfiles,
  getMyProfile
} from "../../controller/profilecontroller/profile.controller.js";
import { protect } from "../../middleware/authMiddleware.js";
import multer from "multer";

const router = express.Router();

const storage = multer.memoryStorage();
const upload = multer({ storage });

router.post(
  "/create",
  protect,
  upload.fields([
    { name: "avatar", maxCount: 1 },
    { name: "backgroundImage", maxCount: 1 },
  ]),
  createProfile
);

router.get("/me", protect, getMyProfile);
router.get("/", protect, getAllProfiles);
router.patch("/:id/status", protect, updateProfileStatus);
router.get("/ourusers", ouruser);
router.get("/approved", getApprovedProfiles);

export default router;
 


