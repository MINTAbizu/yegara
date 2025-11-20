// import express from "express";
// import upload from "../../middleware/digitalproduct/upload.js";
// import {
//   addDigitalProduct,
//   toggleStatus,
//   getApprovedProducts,
//   digitalProductDetail,
//   getAllProductsAdmin,
//   getAllPhysicalProducts,
//   physicalProductDetail
// } from "../../controller/digitalProduct.controller/digitalProduct.controller.js";

// const router = express.Router();

// // Add a new digital product
// router.post("/create", upload.single("image"), addDigitalProduct);

// // Admin routes
// router.get("/admin", getAllProductsAdmin);
// router.patch("/toggle-status/:id", toggleStatus);

// // Public routes
// router.get("/", getApprovedProducts); // list all approved digital products
// router.get("/physical", getAllPhysicalProducts); // list all approved physical products

// // Product details by ID
// router.get("/:id", digitalProductDetail); // digital product details
// router.get("/physical/:id", physicalProductDetail); // physical product details

// export default router;
// routes/digitalProduct.routes.js
import express from "express";
import upload from "../../middleware/digitalproduct/upload.js";
import {
  addDigitalProduct,
  getApprovedProducts,
  getAllProductsAdmin,
  getSingleProduct,
  toggleStatus,
  getDigitalProductById,
  getDigitalProductWithSellerStats
} from "../../controller/digitalProduct.controller/digitalProduct.controller.js";
import { protect } from "../../middleware/authMiddleware.js";

const router = express.Router();
// CREATE PRODUCT
router.post("/create", protect, upload.single("image"), addDigitalProduct);

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
