import physicalProduct from "../../model/physicalproduct/physicalprosuct.model.js"

export const addphyshicalProduct = async (req, res) => {
  try {
    const { productName, price, description, telegram, drive, dropbox, productLink } = req.body;

    if (!req.file) return res.status(400).json({ message: "Product image is required" });

    
    const image = `/uploads/digitalProducts/${req.file.filename}`; // store relative path

    const newProduct = new physicalProduct({
      productName,
      price,
      description,
      image,
      telegram,
      drive,
       seller: req.user._id, // get seller ID from auth
      dropbox,
      productLink,
    });

    await newProduct.save();

    res.status(201).json({ message: "Digital product added successfully", product: newProduct });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error", error });
  }
};

export const getApprovedProducts = async (req, res) => {
  try {
    const products = await physicalProduct.find({ status: "approved" }).sort({ createdAt: -1 });
    res.status(200).json(products);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error", error });
  }
};
export const toggleStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const product = await physicalProduct.findById(id);
    if (!product) return res.status(404).json({ message: "Product not found" });

    // Simple toggle: pending → approved, approved → rejected, rejected → approved
    if (product.status === "pending" || product.status === "rejected") {
      product.status = "approved";
    } else if (product.status === "approved") {
      product.status = "rejected";
    }

    await product.save();
    res.status(200).json({ message: "Status updated successfully", product });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error", error });
  }
};


export const getAllProductsAdmin = async (req, res) => {
  try {
    const products = await physicalProduct.find().sort({ createdAt: -1 });
    res.status(200).json(products);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error", error });
  }
};

export const getSingleProduct = async (req, res) => {
  try {
    const product = await physicalProduct.findById(req.params.id)
      .populate("seller", "name email");

    res.json(product);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
export const getphysicalProductById = async (req, res) => {
  try {
    const product = await physicalProduct.findById(req.params.id)
      .populate("seller", "name email"); // populate seller info

    if (!product) return res.status(404).json({ message: "Product not found" });
    res.json(product);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// controllers/digitalProduct.controller/digitalProductDetail.controller.js

// Get single digital product with seller stats
export const getproductProductWithSellerStats = async (req, res) => {
  try {
    const product = await physicalProduct.findById(req.params.id).populate("seller", "name email");

    if (!product) return res.status(404).json({ message: "Product not found" });

    // Count total products uploaded by seller
    const totalProducts = await physicalProduct.countDocuments({ seller: product.seller._id, status: "approved" });

    // Count sold products (adjust according to your schema)
    const soldProducts = await physicalProduct.countDocuments({ seller: product.seller._id, status: "sold" }); 

    res.json({ product, sellerStats: { totalProducts, soldProducts } });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
