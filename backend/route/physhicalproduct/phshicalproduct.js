import express from "express";
import upload from "../../middleware/physhicalproduct/physicalproductmiddleare.js";
import { addphyshicalProduct,toggleStatus, getSingleProduct,getAllProductsAdmin,getApprovedProducts,getphysicalProductById,getproductProductWithSellerStats } from "../../controller/physicalproduct/physicalproduct.js";
import { protect } from "../../middleware/";
const router = express.Router();

// Add a new digital product
router.post("/create", protect, upload.single("image"), addphyshicalProduct);

// Get all digital products
// Public: Only approved products
router.get("/", getApprovedProducts);
router.get("/:id", getSingleProduct);

// Admin: All products
router.get("/admin", getAllProductsAdmin);

// Admin can approve/reject
router.patch("/toggle-status/:id", toggleStatus);

// details

router.get("/:id", getphysicalProductById);
router.get("/:id", getproductProductWithSellerStats);

export default router;
