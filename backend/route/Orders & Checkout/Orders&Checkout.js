import express from 'express';
import { createOrder, verifyPayment, downloadFile } from '../../controller/Order Controller/OrderController.js';
const router = express.Router();

router.post('/checkout', createOrder); // Create order & return Chapa payment link
router.post('/verify', verifyPayment); // Webhook from Chapa or client verification
router.get('/download/:orderId', downloadFile); // Secure file download

export default router;
