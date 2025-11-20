import express from "express";
import axios from "axios";
import Order from "../../model/order.model.js";
import DigitalProduct from "../../model/digitalproducts/digital products.js";
import PhysicalProduct from "../../model/physicalproduct/physicalprosuct.model.js";

const router = express.Router();

router.post("/create-order", async (req, res) => {
  const { productId, type, buyerEmail } = req.body;

  try {
    const ProductModel = type === "digital" ? DigitalProduct : PhysicalProduct;
    const product = await ProductModel.findById(productId);
    if (!product) return res.status(404).json({ message: "Product not found" });

    const tx_ref = `tx_${Date.now()}_${Math.floor(Math.random() * 1000)}`;

    const response = await axios.post(
      "https://api.chapa.co/v1/transaction/initialize",
      {
        amount: product.price,
        currency: "ETB",
        tx_ref,
        callback_url: "http://localhost:5000/api/payment/webhook",
        return_url: `http://localhost:3000/my-purchases`,
        customer: { email: buyerEmail },
        meta: { productId, type }
      },
      { headers: { Authorization: `Bearer ${process.env.CHAPA_SECRET_KEY}` } }
    );

    // Save order as pending
    const order = new Order({
      buyerEmail,
      productId,
      productType: type,
      price: product.price,
      status: "pending",
      tx_ref
    });
    await order.save();

    res.json({ checkout_url: response.data.data.checkout_url });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Payment initialization failed", error: err });
  }
});

export default router;
