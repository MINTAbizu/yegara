// import axios from "axios";
// import DigitalProduct from "../models/DigitalProduct.js";
// import PhysicalProduct from "../models/PhysicalProduct.js";
// import User from "../models/User.js";
// import mongoose from "mongoose";
// import Order from "../models/Order.js"; // You need Order model same as before

// export const createOrder = async (req,res) => {
//   const { productId, type, buyerEmail } = req.body;
//   const ProductModel = type==="digital"?DigitalProduct:PhysicalProduct;
//   const product = await ProductModel.findById(productId);
//   if(!product || product.status!=="approved") return res.status(400).json({ message:"Product unavailable" });

//   const tx_ref = "TX-"+Date.now();
//   const sellerAmount = product.price*0.9;
//   const platformAmount = product.price*0.1;

//   const order = await Order.create({
//     productId,
//     productName: product.productName,
//     buyerEmail,
//     sellerId: product.sellerId,
//     amount: product.price,
//     sellerAmount,
//     platformAmount,
//     tx_ref
//   });

//   const response = await axios.post("https://api.chapa.co/v1/transaction/initialize",{
//     amount: product.price,
//     currency:"ETB",
//     tx_ref,
//     callback_url:"https://your-backend.com/api/payment/webhook",
//     return_url:"https://your-frontend.com/success",
//     customer:{ email:buyerEmail }
//   },{
//     headers:{ Authorization:`Bearer ${process.env.CHAPA_SECRET_KEY}` }
//   });

//   res.json({ order, checkout_url: response.data.data.checkout_url });
// };

// export const chapaWebhook = async (req,res) => {
//   const { tx_ref,status } = req.body;
//   if(status!=="success") return res.sendStatus(200);
//   const order = await Order.findOne({ tx_ref });
//   if(!order) return res.sendStatus(404);
//   order.status="paid";
//   await order.save();
//   res.sendStatus(200);
// };
import axios from "axios";
import Order from "../../model/Order/Order.js";
// yegna-agency\backend\model\Order\Order.js
import DigitalProduct from "../../model/digitalproducts/digital products.js";
// D:\MERN FULL\github-projects\yegna-agency\yegna-agency\backend\
import User from "../../model/user.model/user.model.js";

export const initiateChapaSplitPayment = async (req, res) => {
  try {
    const { productId, email } = req.body;

    const product = await DigitalProduct.findById(productId).populate("seller");
    if (!product) return res.status(404).json({ message: "Product not found" });

    const amount = product.price;

    // Split rules: 
    // 80% to seller, 20% to platform (example)
    const splitRules = [
      {
        type: "flat",
        recipient: product.seller.chapaWallet || process.env.DEFAULT_SELLER_WALLET,
        amount: amount * 0.8,
      },
      {
        type: "flat",
        recipient: process.env.PLATFORM_CHAPA_WALLET,
        amount: amount * 0.2,
      },
    ];

    const data = {
      amount,
      currency: "ETB",
      email,
      first_name: "Customer",
      last_name: "Name",
      callback_url: `http://localhost:3000/payment/success?productId=${productId}`,
      tx_ref: `TX-${Date.now()}-${productId}`,
      split_rules: splitRules,
    };

    const response = await axios.post(
      "https://api.chapa.co/v1/transaction/initialize",
      data,
      {
        headers: {
          Authorization: `Bearer ${process.env.CHAPA_SECRET_KEY}`,
          "Content-Type": "application/json",
        },
      }
    );

    res.status(200).json({ checkout_url: response.data.data.checkout_url });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
};



// Verify Chapa Payment
export const verifyChapaPayment = async (req, res) => {
  try {
    const { tx_ref } = req.params;

    const response = await axios.get(
      `https://api.chapa.co/v1/transaction/verify/${tx_ref}`,
      {
        headers: { Authorization: `Bearer ${process.env.CHAPA_SECRET_KEY}` },
      }
    );

    const data = response.data.data;

    if (data.status === "success") {
      // Create an order
      await Order.create({
        product: data.meta.productId,
        buyerEmail: data.customer_email,
        amount: data.amount,
        status: "paid",
        tx_ref: data.tx_ref,
      });
    }

    res.json(data);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Payment verification failed", error: err.message });
  }
};


// controller/payment.controller.js

export const initiatePayment = async (req, res) => {
  const { productId, amount, recipientWallet } = req.body;

  try {
    const product = await DigitalProduct.findById(productId).populate("seller");
    if (!product) return res.status(404).json({ message: "Product not found" });

    const data = {
      amount,
      currency: "ETB",
      email: "buyer@example.com", // You can fetch from auth
      tx_ref: `tx_${Date.now()}`,
      first_name: "Buyer",
      last_name: "Name",
      split: [
        {
          type: "flat",
          recipient: recipientWallet, // seller's chapaWallet
          amount,
        },
      ],
      callback_url: "http://localhost:3000/payment-success", // your frontend success page
      return_url: "http://localhost:3000/payment-success",
    };

    const chapaRes = await axios.post("https://api.chapa.co/v1/transaction/initialize", data, {
      headers: { Authorization: `Bearer ${process.env.CHAPA_SECRET_KEY}` },
    });

    res.json({ checkout_url: chapaRes.data.data.checkout_url });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Payment initiation failed" });
  }
};
