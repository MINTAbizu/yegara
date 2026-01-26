
import express from "express";
import dotenv from "dotenv"
dotenv.config();

import mongoose from "mongoose";
import cors from "cors";
import fs from "fs";
import path from "path";

import digitalProductRoutes from "./route/digitalProduct.route/digitalProduct.route.js";
// import physicalProductRoutes from "./route/physhicalproduct/phshicalproduct.js";
import userregister from "./route/user.route/user.route.js";
import chapapayment from "./route/payments/payment.route.js";
// kyc

import kycRoutes from './route/kyc/kyc.route.js'
// profileRoutes
import profileRoutes from './route/profile.route/profile.route.js'

import chatRoutes from "./route/Ai/chat.js";


// import telegeram from './route/telegram.routes.js'


const app = express();
const PORT = process.env.PORT || 5000;

// CORS
app.use(
  cors({
    origin: [
      "http://localhost:5173",      // Vite local
      "https://yegara.netlify.app",  // Netlify production
      "https://twiness.netlify.app"
    ],
    credentials: true,
  })
);
app.use(express.json());

// MongoDB
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("✅ Connected to MongoDB"))
  .catch(err => console.error("❌ MongoDB connection error:", err));
  const __dirname = path.resolve(); // if using ES modules

// Make uploads folder publicly accessible
app.use("/uploads", express.static(path.join(__dirname, "uploads")));
  app.use("/uploads", express.static(path.join(process.cwd(), "uploads")));

// Ensure upload folders exist
//digital product
const digitalProductUploadPath = path.join(process.cwd(), "uploads/digitalProducts");
if (!fs.existsSync(digitalProductUploadPath)) fs.mkdirSync(digitalProductUploadPath, { recursive: true });
// physhical product



const physhicalProductUploadPath = path.join(process.cwd(), "uploads/physicalProducts");
if (!fs.existsSync(physhicalProductUploadPath)) fs.mkdirSync(physhicalProductUploadPath, { recursive: true });

const booksProductUploadPath = path.join(process.cwd(), "uploads/digitalProducts");
if (!fs.existsSync(booksProductUploadPath)) fs.mkdirSync(booksProductUploadPath, { recursive: true });






// Serve uploaded images
app.use("/uploads/digitalProducts", express.static(digitalProductUploadPath));
app.use("/uploads/physicalproduct", express.static(physhicalProductUploadPath));
app.use("/uploads/bookProducts", express.static(booksProductUploadPath));

// Routes
app.use("/api/digital-products", digitalProductRoutes);
// app.use("/api/physical-products", physicalProductRoutes);
app.use("/api/users", userregister);
// app.use('/api',socialmedia)
// kyc
app.use("/api/kyc", kycRoutes)
// // Profile routes
app.use("/api/profile", profileRoutes);
app.use("/api/payment", chapapayment);
// app.use("/telegram", telegeram);

// AI chat route
app.use("/api/chat", chatRoutes);


// Error handler (return JSON for API errors)
app.use((err, req, res, next) => {
  console.error('Unhandled error:', err);
  if (res.headersSent) return next(err);
  res.status(err.status || 500).json({ message: err.message || 'Server error' });
});


app.get("/", (req, res) => {
  res.send("Ye-Gara Shop AI is running");
});
// Start server
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
