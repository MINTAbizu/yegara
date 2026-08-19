import axios from "axios";
import fs from "fs";
import path from "path";
import Book from "../../model/Book/Book.model.js";
import Order from "../../model/Order/Order.js";
import User from "../../model/user.model/user.model.js";

const clientUrl = () => (process.env.CLIENT_URL || process.env.FRONTEND_URL || "http://localhost:5173").replace(/\/$/, "");

const getUploadedFile = (req, field) => {
  if (req.files?.[field]?.[0]) return req.files[field][0];
  if (req.file && field === "image") return req.file;
  return null;
};

export const addDigitalProduct = async (req, res) => {
  try {
    const { bookName, price, description } = req.body;
    const image = getUploadedFile(req, "image");
    const bookFile = getUploadedFile(req, "bookFile");

    if (!bookName || !price || !description) {
      return res.status(400).json({ message: "Book name, price, and description are required" });
    }

    if (!image) return res.status(400).json({ message: "Book cover image is required" });
    if (!bookFile) return res.status(400).json({ message: "Book file is required" });

    const newProduct = new Book({
      bookName: bookName.trim(),
      price: Number(price),
      description: description.trim(),
      seller: req.user._id,
      image: `/uploads/bookProducts/${image.filename}`,
      bookFile: bookFile.filename,
      originalFileName: bookFile.originalname,
      fileType: path.extname(bookFile.originalname).replace(".", "").toLowerCase(),
      status: "pending",
    });

    const saved = await newProduct.save();
    res.status(201).json({ message: "Book submitted for admin approval", product: saved });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};

export const toggleStatus = async (req, res) => {
  try {
    const product = await Book.findById(req.params.id);
    if (!product) return res.status(404).json({ message: "Book not found" });

    product.status = product.status === "approved" ? "rejected" : "approved";
    await product.save();
    res.status(200).json({ message: "Status updated successfully", product });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error", error });
  }
};

export const getApprovedProducts = async (req, res) => {
  try {
    const products = await Book.find({ status: "approved" })
      .select("bookName price description image fileType seller averageRating createdAt")
      .populate("seller", "name email")
      .sort({ createdAt: -1 });
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getAllProductsAdmin = async (req, res) => {
  try {
    const products = await Book.find().populate("seller", "name email").sort({ createdAt: -1 });
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getSingleProduct = async (req, res) => {
  try {
    const product = await Book.findById(req.params.id)
      .select("bookName price description image fileType seller status createdAt")
      .populate("seller", "name email");

    if (!product || product.status !== "approved") {
      return res.status(404).json({ message: "Book not found" });
    }

    res.json(product);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const initiateBookPayment = async (req, res) => {
  try {
    const book = await Book.findOne({ _id: req.params.id, status: "approved" }).populate("seller", "name email chapaWallet");
    if (!book) return res.status(404).json({ message: "Book is not available" });
    if (!process.env.CHAPA_SECRET_KEY) return res.status(500).json({ message: "Payment gateway is not configured" });

    const txRef = `book_${book._id}_${req.user._id}_${Date.now()}`;
    const order = await Order.create({
      product: book._id,
      productModel: "DigitalProduct",
      productType: "book",
      buyerId: req.user._id,
      buyerEmail: req.user.email,
      sellerId: book.seller?._id,
      amount: book.price,
      status: "pending",
      tx_ref: txRef,
    });

    const [firstName, ...lastNameParts] = (req.user.name || "Yegara Buyer").split(" ");
    const returnUrl = `${clientUrl()}/book/payment-callback?tx_ref=${encodeURIComponent(txRef)}`;
    const payload = {
      amount: book.price,
      currency: "ETB",
      email: req.user.email,
      first_name: firstName || "Yegara",
      last_name: lastNameParts.join(" ") || "Buyer",
      tx_ref: txRef,
      callback_url: returnUrl,
      return_url: returnUrl,
      title: `Book purchase: ${book.bookName}`,
      description: `Digital book access for ${book.bookName}`,
      meta: { orderId: order._id.toString(), bookId: book._id.toString(), buyerId: req.user._id.toString() },
    };

    const chapaRes = await axios.post("https://api.chapa.co/v1/transaction/initialize", payload, {
      headers: { Authorization: `Bearer ${process.env.CHAPA_SECRET_KEY}`, "Content-Type": "application/json" },
      timeout: 20000,
    });

    const checkoutUrl = chapaRes.data?.data?.checkout_url;
    if (!checkoutUrl) return res.status(502).json({ message: "Payment gateway did not return a checkout URL" });

    res.status(200).json({ checkout_url: checkoutUrl, tx_ref: txRef, orderId: order._id });
  } catch (error) {
    console.error("initiateBookPayment error:", error.response?.data || error.message);
    res.status(502).json({ message: error.response?.data?.message || "Unable to start payment" });
  }
};

export const verifyBookPayment = async (req, res) => {
  try {
    const { tx_ref: txRef } = req.params;
    const order = await Order.findOne({ tx_ref: txRef, buyerId: req.user._id });
    if (!order) return res.status(404).json({ message: "Order not found" });

    const verifyRes = await axios.get(`https://api.chapa.co/v1/transaction/verify/${txRef}`, {
      headers: { Authorization: `Bearer ${process.env.CHAPA_SECRET_KEY}` },
      timeout: 20000,
    });

    if (verifyRes.data?.data?.status !== "success") {
      return res.status(400).json({ message: "Payment was not successful" });
    }

    order.status = "paid";
    await order.save();

    res.json({ message: "Payment verified. Book access is now available.", order });
  } catch (error) {
    console.error("verifyBookPayment error:", error.response?.data || error.message);
    res.status(500).json({ message: "Payment verification failed" });
  }
};

export const getMyBookPurchases = async (req, res) => {
  try {
    const orders = await Order.find({ buyerId: req.user._id, productType: "book" })
      .populate("product")
      .sort({ createdAt: -1 });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const downloadPurchasedBook = async (req, res) => {
  try {
    const order = await Order.findOne({ _id: req.params.orderId, buyerId: req.user._id, productType: "book" }).populate("product");
    if (!order) return res.status(404).json({ message: "Purchase not found" });
    if (order.status !== "paid") return res.status(403).json({ message: "Payment not completed" });
    if (!order.product?.bookFile) return res.status(404).json({ message: "Book file not found" });

    const filePath = path.join(process.cwd(), "uploads", "bookProducts", order.product.bookFile);
    if (!fs.existsSync(filePath)) return res.status(404).json({ message: "File not found on server" });

    res.download(filePath, order.product.originalFileName || `${order.product.bookName}.pdf`);
  } catch (error) {
    console.error("downloadPurchasedBook error:", error);
    res.status(500).json({ message: "Unable to download book" });
  }
};

export const getDigitalProductById = getSingleProduct;
export const getDigitalProductWithSellerStats = async (req, res) => {
  try {
    const product = await Book.findById(req.params.id).populate("seller", "name email");
    if (!product) return res.status(404).json({ message: "Book not found" });
    const totalProducts = await Book.countDocuments({ seller: product.seller._id, status: "approved" });
    const soldProducts = await Order.countDocuments({ sellerId: product.seller._id, productType: "book", status: "paid" });
    res.json({ product, sellerStats: { totalProducts, soldProducts } });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
