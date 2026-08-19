
import express from "express";
import upload from "../../middleware/book/book.middleware.js";
import {
  addDigitalProduct,
  getApprovedProducts,
  getAllProductsAdmin,
  getSingleProduct,
  toggleStatus,
  getDigitalProductById,
  getDigitalProductWithSellerStats,
  initiateBookPayment,
  verifyBookPayment,
  getMyBookPurchases,
  downloadPurchasedBook
} from "../../controller/Book/Book.controller.js";
import { protect, adminOnly } from "../../middleware/authMiddleware.js";

const router = express.Router();
// CREATE PRODUCT
router.post(
  "/create",
  protect,
  upload.fields([
    { name: "image", maxCount: 1 },
    { name: "bookFile", maxCount: 1 },
  ]),
  addDigitalProduct
);

// USER PAGES
router.get("/", getApprovedProducts);
router.get("/purchases/me", protect, getMyBookPurchases);
router.post("/:id/checkout", protect, initiateBookPayment);
router.post("/payment/verify/:tx_ref", protect, verifyBookPayment);
router.get("/download/:orderId", protect, downloadPurchasedBook);

// ADMIN PAGES
router.get("/admin/all", protect, adminOnly, getAllProductsAdmin);
router.patch("/admin/toggle/:id", protect, adminOnly, toggleStatus);


// details
router.get("/:id", getSingleProduct);
export default router;
