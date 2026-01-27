
import express from "express";
import upload from "../../middleware/giftproductmiddlewarw/gift-middel.js";
import {
  addgiftproduct,
  getApprovedProducts,
  getAllProductsAdmin,
  getSingleProduct,
  toggleStatus,
  getDigitalProductById,
  getDigitalProductWithSellerStats
} from "../../controller/giftproduct/Giftproduct.js";
import { protect } from "../../middleware/authMiddleware.js";

const router = express.Router();
// CREATE PRODUCT
router.post("/create", protect, upload.single("image"), addgiftproduct);

// USER PAGES
router.get("/", getApprovedProducts);
router.get("/:id", getSingleProduct);




// ADMIN PAGES
router.get("/admin/all", getAllProductsAdmin);
router.patch("/admin/toggle/:id", toggleStatus);


// details

router.get("/:id", getDigitalProductById);
router.get("/:id", getDigitalProductWithSellerStats);
export default router;
