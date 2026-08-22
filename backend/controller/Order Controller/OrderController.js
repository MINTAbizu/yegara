import Order from '../../model/Order/Order.js';
import DigitalProduct from '../../model/digitalproducts/digital products.js';
import PhysicalProduct from '../../model/physicalproduct/physicalprosuct.model.js';
import User from '../../model/user.model/user.model.js';
import axios from 'axios';
import crypto from 'crypto';
import fs from 'fs';
import path from 'path';

const CHAPA_SECRET_KEY = process.env.CHAPA_SECRET_KEY;

// Create Order + Chapa Checkout
export const createOrder = async (req, res) => {
  try {
    const { buyerId, productId, productType } = req.body;

    const product = productType === 'DigitalProduct'
      ? await DigitalProduct.findById(productId)
      : await PhysicalProduct.findById(productId);

    if (!product) return res.status(404).json({ message: 'Product not found' });
    if (product.status !== 'approved') return res.status(400).json({ message: 'Product not approved yet' });

    const seller = await User.findById(product.sellerId);

    const order = new Order({
      buyer: buyerId,
      seller: seller._id,
      product: product._id,
      productType,
      price: product.price,
      status: 'pending',
    });
    await order.save();

    // Chapa Payment Link
    const response = await axios.post('https://api.chapa.co/v1/transaction/initialize', {
      amount: product.price,
      currency: "ETB",
      email: req.body.buyerEmail,
      tx_ref: order._id.toString(),
      callback_url: `${process.env.FRONTEND_URL}/order-success?orderId=${order._id}`,
    }, {
      headers: { Authorization: `Bearer ${CHAPA_SECRET_KEY}` }
    });

    res.status(201).json({ orderId: order._id, paymentUrl: response.data.data.checkout_url });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error', error });
  }
};

// Verify Payment (Webhook)
export const verifyPayment = async (req, res) => {
  try {
    const { tx_ref } = req.body;

    const order = await Order.findById(tx_ref);
    if (!order) return res.status(404).json({ message: 'Order not found' });

    const verify = await axios.get(`https://api.chapa.co/v1/transaction/verify/${tx_ref}`, {
      headers: { Authorization: `Bearer ${CHAPA_SECRET_KEY}` }
    });

    if (verify.data.data.status === 'success') {
      order.status = 'paid';
      await order.save();

      // Split Payment
      const seller = await User.findById(order.seller);
      const platformFee = order.price * 0.1;
      seller.balance += order.price - platformFee;
      await seller.save();

      return res.status(200).json({ message: 'Payment verified', order });
    }

    res.status(400).json({ message: 'Payment not successful' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error', error });
  }
};

// Download Digital Product
export const downloadFile = async (req, res) => {
  try {
    const { orderId } = req.params;
    const order = await Order.findById(orderId).populate('product');

    if (!order) return res.status(404).json({ message: 'Order not found' });
    if (order.status !== 'paid') return res.status(403).json({ message: 'Payment not completed' });

    if (order.productType !== 'DigitalProduct') return res.status(400).json({ message: 'Only digital products can be downloaded' });

    const filePath = path.join(process.cwd(), 'uploads', 'digitalProducts', order.product.file);
    if (!fs.existsSync(filePath)) return res.status(404).json({ message: 'File not found' });

    res.download(filePath);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error', error });
  }
};


