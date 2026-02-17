import DigitalProduct from "../../model/digitalproducts/digital products.js";
import PhysicalProduct from "../../model/physicalproduct/physicalprosuct.model.js"; // assuming you have this
import User from "../../model/user.model/user.model.js";

// Add a new digital product


// export const addDigitalProduct = async (req, res) => {
//   console.log("=== NEW PRODUCT UPLOAD ===");
//   console.log("REQ BODY:", req.body);
//   console.log("REQ FILE:", req.file);  // ✅ add here

//   try {
//     const { productName, description, price } = req.body;

//     const imageUrl = req.file?.secure_url;

//     const newProduct = new DigitalProduct({
//       productName,
//       description,
//       price,
//       seller: req.user._id,
//       image: imageUrl,
//     });

//     const saved = await newProduct.save();
//     res.status(201).json(saved);

//   } catch (error) {
//     console.error("ERROR:", error);
//     res.status(500).json({ message: error.message });
//   }
// };
// export const addDigitalProduct = async (req, res) => {
//   console.log("REQ FILE:", req.file);
//   console.log("REQ BODY:", req.body);

//   try {
//     const { productName, description, price } = req.body;

//     const imageUrl = req.file?.path;   // <-- important

//     const newProduct = new DigitalProduct({
//       productName,
//       description,
//       price,
//       seller: req.user._id,
//       image: imageUrl,
//     });

//     const saved = await newProduct.save();
//     res.status(201).json(saved);
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ message: error.message });
//   }
// };

// import DigitalProduct from "../../model/digitalproducts/digital products.js";

// export const addDigitalProduct = async (req, res) => {
//   try {
//     const { productName, description, price, telegram, drive, dropbox, productLink, lat, lng } = req.body;

//     const imageUrl = req.file?.path;

//     const newProduct = new DigitalProduct({
//       productName,
//       description,
//       price,
//       telegram,
//       drive,
//       dropbox,
//       productLink,
//       seller: req.user._id,
//       image: imageUrl,
//       location: lat && lng ? {
//         type: "Point",
//         coordinates: [parseFloat(lng), parseFloat(lat)]
//       } : undefined
//     });

//     const saved = await newProduct.save();
//     res.status(201).json(saved);

//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ message: error.message });
//   }
// };
// import axios from "axios";

// export const addDigitalProduct = async (req, res) => {
//   try {
//     const {
//       productName,
//       description,
//       price,
//       telegram,
//       drive,
//       dropbox,
//       productLink,
//       lat,
//       lng,
//     } = req.body;

//     const imageUrl = req.file?.path;

//     let location;
//     let locationName = null;

//     // ================= REVERSE GEOCODE =================
//     if (lat && lng) {
//       const latitude = parseFloat(lat);
//       const longitude = parseFloat(lng);

//       location = {
//         type: "Point",
//         coordinates: [longitude, latitude],
//       };

//       try {
//         const geo = await axios.get(
//           `https://nominatim.openstreetmap.org/reverse`,
//           {
//             params: {
//               lat: latitude,
//               lon: longitude,
//               format: "json",
//             },
//             headers: {
//               "User-Agent": "your-app-name",
//             },
//           }
//         );

//         locationName =
//           geo.data.address.city ||
//           geo.data.address.town ||
//           geo.data.address.village ||
//           geo.data.display_name ||
//           null;
//           console.log("Location name:", locationName);

//       } catch (geoError) {
//         console.warn("Reverse geocode failed:", geoError.message);
//       }
//     }

//     const newProduct = new DigitalProduct({
//       productName,
//       description,
//       price,
//       telegram,
//       drive,
//       dropbox,
//       productLink,
//       seller: req.user._id,
//       image: imageUrl,
//       location,
//       locationName,
//     });

//     const saved = await newProduct.save();

//     res.status(201).json(saved);

//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ message: error.message });
//   }
// };
// import Product from "../models/Product.js";
import axios from "axios";

// Create digital product
export const addDigitalProduct = async (req, res) => {
  try {
    const { productName, description, price, telegram, drive, dropbox, productLink, lat, lng } = req.body;
    const imageUrl = req.file?.path;

    let locationObj = null;
    let region = "", subcity = "", woreda = "", kebele = "", display_name = "";

    if (lat && lng) {
      const latitude = parseFloat(lat);
      const longitude = parseFloat(lng);

      locationObj = { type: "Point", coordinates: [longitude, latitude] };

      // Reverse geocode
      try {
        const geo = await axios.get("https://nominatim.openstreetmap.org/reverse", {
          params: { lat: latitude, lon: longitude, format: "json", addressdetails: 1 },
          headers: { "User-Agent": "digital-product-app" }
        });

        const addr = geo.data.address || {};
        display_name = geo.data.display_name || "";

        region = addr.state || addr.region || addr.city || addr.town || "";
        subcity = addr.city_district || addr.suburb || addr.quarter || "";
        woreda = addr.neighbourhood || addr.locality || addr.hamlet || "";
        kebele = addr.village || addr.croft || addr.kebele || "";

      } catch (err) {
        console.warn("Reverse geocode failed:", err.message);
      }
    }

    const newProduct = new DigitalProduct({
      productName,
      description,
      price,
      telegram,
      drive,
      dropbox,
      productLink,
      seller: req.user._id,
      image: imageUrl,
      location: locationObj,
      region,
      subcity,
      woreda,
      kebele,
      display_name,
    });

    const saved = await newProduct.save();
    res.status(201).json(saved);

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};



export const toggleStatus = async (req, res) => {
  try {
    const { id } = req.params;

    const product = await DigitalProduct.findById(id);
    if (!product) return res.status(404).json({ message: "Product not found" });

    if (product.status === "pending" || product.status === "rejected") {
      product.status = "approved";
    } else if (product.status === "approved") {
      product.status = "rejected";
    }

    await product.save();

    res.json({ message: "Status updated", product });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
};


// List all approved digital products
// export const getApprovedProducts = async (req, res) => {
//   try {
//     const products = await DigitalProduct.find({ status: "approved" }).populate("seller", "name email");
//     res.json(products);
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// };
export const getApprovedProducts = async (req, res) => {
  try {
    const products = await DigitalProduct.find({ status: "approved" })
      .populate("seller", "name email")
      .select("productName price image seller averageRating ratings");

    res.json(products);
    // console.log(products)
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


// Admin: list all products
export const getAllProductsAdmin = async (req, res) => {
  try {
    const products = await DigitalProduct.find().populate("seller", "name email");
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


// Get digital product details by ID (with seller info)
export const digitalProductDetail = async (req, res) => {
  try {
    const product = await DigitalProduct.findById(req.params.id)
      .populate("sellerId", "name email"); // populate seller info
    if (!product) return res.status(404).json({ message: "Product not found" });
    res.json(product);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error", error });
  }
};

// Physical products
export const getAllPhysicalProducts = async (req, res) => {
  try {
    const products = await PhysicalProduct.find({ status: "approved" }).sort({ createdAt: -1 });
    res.json(products);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error", error });
  }
};

export const physicalProductDetail = async (req, res) => {
  try {
    const product = await PhysicalProduct.findById(req.params.id)
      .populate("sellerId", "name email");
    if (!product) return res.status(404).json({ message: "Product not found" });
    res.json(product);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error", error });
  }
};
export const getSingleProduct = async (req, res) => {
  try {
    const product = await DigitalProduct.findById(req.params.id)
      .populate("seller", "name email");

    res.json(product);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
// detal

export const getDigitalProductById = async (req, res) => {
  try {
    const product = await DigitalProduct.findById(req.params.id)
      .populate("seller", "name email"); // populate seller info

    if (!product) return res.status(404).json({ message: "Product not found" });
    res.json(product);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


// controllers/digitalProduct.controller/digitalProductDetail.controller.js

// Get single digital product with seller stats
export const getDigitalProductWithSellerStats = async (req, res) => {
  try {
    const product = await DigitalProduct.findById(req.params.id).populate("seller", "name email");

    if (!product) return res.status(404).json({ message: "Product not found" });

    // Count total products uploaded by seller
    const totalProducts = await DigitalProduct.countDocuments({ seller: product.seller._id, status: "approved" });

    // Count sold products (adjust according to your schema)
    const soldProducts = await DigitalProduct.countDocuments({ seller: product.seller._id, status: "sold" }); 

    res.json({ product, sellerStats: { totalProducts, soldProducts } });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};







export const rateDigitalProduct = async (req, res) => {
  try {
    const { rating } = req.body;
    const productId = req.params.id;
    const userId = req.user._id;

    if (!rating || rating < 1 || rating > 5) {
      return res.status(400).json({ message: "Rating must be between 1 and 5" });
    }

    const product = await DigitalProduct.findById(productId);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    // ❌ Prevent duplicate rating
    const alreadyRated = product.ratings.find(
      (r) => r.user.toString() === userId.toString()
    );

    if (alreadyRated) {
      return res.status(400).json({ message: "You already rated this product" });
    }

    // ✅ Add rating
    product.ratings.push({ user: userId, value: rating });

    // ✅ Calculate average
    const total = product.ratings.reduce((sum, r) => sum + r.value, 0);
    product.averageRating = total / product.ratings.length;

    await product.save();

    res.status(200).json({
      message: "Rating submitted",
      averageRating: product.averageRating,
      totalRatings: product.ratings.length
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

