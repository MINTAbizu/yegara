import express from "express";
import { getAllDigitalProducts, digitalProductDetail } from "../../controller/digitalProduct.controller/digitalproductdetail.js";

const router = express.Router();

// Get all approved digital products
router.get("/", getAllDigitalProducts);

// Get single digital product by ID
router.get("/:id", digitalProductDetail);

export default router;