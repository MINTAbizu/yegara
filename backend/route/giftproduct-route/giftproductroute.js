
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


import PhysicalProduct from "../../model/physicalproduct/physicalprosuct.model.js";
import giftproduct from "../../model/giftproduct/giftproduct.js";

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


router.get("/products/by-seller/:sellerId", async (req, res) => {
  try {
    const { sellerId } = req.params;

    const digital = await giftproduct.find({ seller: sellerId });
    const physical = await PhysicalProduct.find({ seller: sellerId });

    res.json([...digital, ...physical]);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch products" });
  }
});