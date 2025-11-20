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