
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

// routes/digitalProducts.js (add this)
// router.get("/nearby", async (req, res) => {
//   try {
//     const { lat, lng, maxDistanceKm = 10 } = req.query;

//     if (!lat || !lng) return res.status(400).json({ message: "Missing coordinates" });

//     const products = await Product.find({
//       status: "approved",
//       location: {
//         $near: {
//           $geometry: { type: "Point", coordinates: [parseFloat(lng), parseFloat(lat)] },
//           $maxDistance: parseFloat(maxDistanceKm) * 1000, // meters
//         },
//       },
//     });

//     res.json(products);
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ message: "Server error" });
//   }
// });
router.get("/nearby", async (req, res) => {
  try {
    const { lat, lng, maxDistanceKm } = req.query;
    if (!lat || !lng) return res.status(400).json({ message: "lat/lng required" });

    const maxDistanceMeters = (maxDistanceKm ? parseFloat(maxDistanceKm) : 5) * 1000;

    const products = await Product.find({
      location: {
        $nearSphere: {
          $geometry: { type: "Point", coordinates: [parseFloat(lng), parseFloat(lat)] },
          $maxDistance: maxDistanceMeters,
        },
      },
    });

    res.json(products);
  } catch (err) {
    console.error("Nearby endpoint error:", err);
    res.status(500).json({ message: "Server error fetching nearby products", error: err.message });
  }
});
