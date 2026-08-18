import physicalProduct from "../../model/physicalproduct/physicalprosuct.model.js";

export const addphyshicalProduct = async (req, res) => {
  try {
    const { productName, price, description, telegram, drive, dropbox, productLink } = req.body;
    const imageUrl = req.file?.path;

    if (!req.file) {
      return res.status(400).json({ message: "Product image is required" });
    }

    const newProduct = new physicalProduct({
      productName,
      price,
      description,
      image: imageUrl,
      telegram,
      drive,
      seller: req.user._id,
      dropbox,
      productLink,
    });

    const saved = await newProduct.save();
    return res.status(201).json({ message: "physical product added successfully", product: saved });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server Error", error });
  }
};

export const getApprovedProducts = async (req, res) => {
  try {
    const products = await physicalProduct.find({ status: "approved" }).populate("seller", "name email");
    return res.status(200).json(products);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server Error", error });
  }
};

export const toggleStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    const allowedStatuses = ["pending", "approved", "rejected"];

    if (status && !allowedStatuses.includes(status)) {
      return res.status(400).json({ message: "Invalid product status" });
    }

    const product = await physicalProduct.findById(id);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    product.status = status || (product.status === "approved" ? "rejected" : "approved");
    await product.save();

    return res.status(200).json({ message: "Status updated successfully", product });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server Error", error });
  }
};

export const getAllProductsAdmin = async (req, res) => {
  try {
    const products = await physicalProduct.find().populate("seller", "name email");
    return res.status(200).json(products);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server Error", error });
  }
};

export const getSingleProduct = async (req, res) => {
  try {
    const product = await physicalProduct.findById(req.params.id).populate("seller", "name email");
    return res.json(product);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const getphysicalProductById = async (req, res) => {
  try {
    const product = await physicalProduct.findById(req.params.id).populate("seller", "name email");

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    return res.json(product);
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

export const getproductProductWithSellerStats = async (req, res) => {
  try {
    const product = await physicalProduct.findById(req.params.id).populate("seller", "name email");

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    const totalProducts = await physicalProduct.countDocuments({ seller: product.seller._id, status: "approved" });
    const soldProducts = await physicalProduct.countDocuments({ seller: product.seller._id, status: "sold" });

    return res.json({ product, sellerStats: { totalProducts, soldProducts } });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};
