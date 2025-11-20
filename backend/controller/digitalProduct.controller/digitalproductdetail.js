
import DigitalProduct from "../../model/digitalproducts/DigitalProduct.js";
import PhysicalProduct from "../../model/physicalproduct/PhysicalProduct.js";

// Get all approved digital products
export const getAllDigitalProducts = async (req, res) => {
  try {
    const products = await DigitalProduct.find({ status: "approved" }).sort({ createdAt: -1 });
    res.json(products);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get digital product detail by ID
export const digitalProductDetail = async (req, res) => {
  try {
    const product = await DigitalProduct.findById(req.params.id);
    if (!product) return res.status(404).json({ message: "Product not found" });
    res.json(product);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get all approved physical products
export const getAllPhysicalProducts = async (req, res) => {
  try {
    const products = await PhysicalProduct.find({ status: "approved" }).sort({ createdAt: -1 });
    res.json(products);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get physical product detail by ID
export const physicalProductDetail = async (req, res) => {
  try {
    const product = await PhysicalProduct.findById(req.params.id);
    if (!product) return res.status(404).json({ message: "Product not found" });
    res.json(product);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
// digitalProduct.controller.js
export const getDigitalProductById = async (req, res) => {
  try {
    const product = await DigitalProduct.findById(req.params.id).populate("sellerId", "name email");
    if (!product) return res.status(404).json({ message: "Product not found" });
    res.json(product);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

