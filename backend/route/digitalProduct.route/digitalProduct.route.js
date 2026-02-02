
import express from "express";
import upload from "../../middleware/digitalproduct/upload.js";
import {
  addDigitalProduct,
  getApprovedProducts,
  getAllProductsAdmin,
  getSingleProduct,
  toggleStatus,
  getDigitalProductById,
  getDigitalProductWithSellerStats,
  rateDigitalProduct
} from "../../controller/digitalProduct.controller/digitalProduct.controller.js";
import { protect } from "../../middleware/authMiddleware.js";
import digitalProducts from "../../model/digitalproducts/digital products.js";
import PhysicalProduct from "../../model/physicalproduct/physicalprosuct.model.js";

const router = express.Router();
// CREATE PRODUCT
router.post("/create", protect, upload.single("image"), addDigitalProduct);

// USER PAGES
router.get("/", getApprovedProducts);
router.get("/:id", getSingleProduct);


router.post("/:id/rate", rateDigitalProduct);

// ADMIN PAGES
router.get("/admin/all", getAllProductsAdmin);
router.patch("/admin/toggle/:id", toggleStatus);


// details

router.get("/:id", getDigitalProductById);
router.get("/:id", getDigitalProductWithSellerStats);
export default router;

router.get("/products/by-seller/:sellerId", async (req, res) => {
  try {
    const { sellerId } = req.params;

    const digital = await digitalProducts.find({ seller: sellerId });
    const physical = await PhysicalProduct.find({ seller: sellerId });

    res.json([...digital, ...physical]);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch products" });
  }
});
