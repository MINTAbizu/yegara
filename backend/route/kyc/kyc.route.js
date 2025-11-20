import express from "express";
import upload from "../../middleware/kyc/middlewareupload.js";
import { submitKYC, getAllKYC, deleteKYC } from "../../controller/kyc/kyc.controller.js";
import { protect } from '../../middleware/authMiddleware.js';
import KYC from "../../model/kyc/kyc.model.js";
const router = express.Router();

router.post(
  "/submit-kyc",
  protect,
  upload.fields([
    { name: "faceId", maxCount: 1 },
    { name: "idFront", maxCount: 1 },
    { name: "idBack", maxCount: 1 },
  ]),
  async (req, res) => {
    
    try {
      const { fullName, dob, gender, nationality, maritalStatus, idType, idNumber, issueDate, expireDate, residentialAddress, phone, email } = req.body;
      const kyc = new KYC({
        user: req.user._id,
        fullName, dob, gender, nationality, maritalStatus,
        idType, idNumber, issueDate, expireDate,
        residentialAddress, phone, email,
        faceId: req.files.faceId?.[0]?.filename,
        idFront: req.files.idFront?.[0]?.filename,
        idBack: req.files.idBack?.[0]?.filename,
      });
      await kyc.save();
      res.status(201).json({ message: "KYC submitted successfully", data: kyc });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Server Error" });
    }
  }
);


router.get("/", getAllKYC);           // Get all KYC
router.delete("/:id", deleteKYC);     // Delete KYC

export default router;
