import express from "express";
import upload from "../../middleware/physhicalproduct/physicalproduct.middleare.js";
import { addphyshicalProduct,toggleStatus, getAllProductsAdmin,getApprovedProducts } from "../../controller/physicalproduct/physicalproduct.js";

const router = express.Router();

// Add a new digital product
router.post("/create", upload.single("image"), addphyshicalProduct);

// Get all digital products
// Public: Only approved products
router.get("/", getApprovedProducts);

// Admin: All products
router.get("/admin", getAllProductsAdmin);

// Admin can approve/reject
router.patch("/toggle-status/:id", toggleStatus);;

export default router;
