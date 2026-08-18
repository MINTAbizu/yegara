import express from "express";
import upload from "../../middleware/physhicalproduct/physicalproductmiddleare.js";
import {
  addphyshicalProduct,
  getAllProductsAdmin,
  getApprovedProducts,
  getphysicalProductById,
  getproductProductWithSellerStats,
  toggleStatus,
} from "../../controller/physicalproduct/physicalproduct.js";
import { protect } from "../../middleware/authMiddleware.js";

const router = express.Router();

router.post("/create", protect, upload.single("image"), addphyshicalProduct);
router.get("/", getApprovedProducts);
router.get("/admin", protect, getAllProductsAdmin);
router.patch("/toggle-status/:id", protect, toggleStatus);
router.get("/:id/stats", getproductProductWithSellerStats);
router.get("/:id", getphysicalProductById);

export default router;

