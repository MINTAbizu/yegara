import axios from "axios";
import crypto from "crypto";
import mongoose from "mongoose";
import Transaction from "../../model/Payment/Transaction.js";
import EqubChallenge from "../../models/EqubChallenge.model.js";
import User from "../../model/user.model/user.model.js";
import {
  fulfillDirectPurchase,
  findPurchasableProduct,
  reserveEqubSlot,
  withMongoTransaction,
} from "../../services/chapaPayment.service.js";

const CHAPA_INITIALIZE_URL = "https://api.chapa.co/v1/transaction/initialize";
const CHAPA_VERIFY_URL = "https://api.chapa.co/v1/transaction/verify";
const PURPOSES = ["DIRECT_PURCHASE", "CROWDFUND_JOIN"];

const frontendUrl = () => (process.env.FRONTEND_URL || process.env.CLIENT_URL || "http://localhost:5173").replace(/\/$/, "");
const backendUrl = () => (process.env.BACKEND_URL || "http://localhost:5000").replace(/\/$/, "");
const moneyMatches = (left, right) => Number(left).toFixed(2) === Number(right).toFixed(2);

const safeCompare = (expected, received) => {
  if (!expected || !received) return false;
  const expectedBuffer = Buffer.from(expected, "hex");
  const receivedBuffer = Buffer.from(received, "hex");
  return expectedBuffer.length === receivedBuffer.length && crypto.timingSafeEqual(expectedBuffer, receivedBuffer);
};

const buildSignature = (req) => {
  const payload = req.rawBody || JSON.stringify(req.body);
  return crypto.createHmac("sha256", process.env.CHAPA_WEBHOOK_SECRET).update(payload).digest("hex");
};

const verifyWebhookSignature = (req) => {
  if (!process.env.CHAPA_WEBHOOK_SECRET) return false;
  const expected = buildSignature(req);
  const xChapaSignature = req.headers["x-chapa-signature"];
  const chapaSignature = req.headers["chapa-signature"];

  return safeCompare(expected, xChapaSignature) || safeCompare(expected, chapaSignature);
};

const verifyChapaTransaction = async (txRef) => {
  const response = await axios.get(`${CHAPA_VERIFY_URL}/${encodeURIComponent(txRef)}`, {
    headers: { Authorization: `Bearer ${process.env.CHAPA_SECRET_KEY}` },
    timeout: 20000,
  });

  return response.data?.data;
};

const processSuccessfulTransaction = async ({ transaction, chapaPayment, email }) => {
  if (transaction.status === "SUCCESS") return null;

  return withMongoTransaction(async (session) => {
    const lockedTransaction = await Transaction.findOne({ txRef: transaction.txRef }).session(session);
    if (!lockedTransaction) {
      throw Object.assign(new Error("Transaction record was not found."), { status: 404 });
    }

    if (lockedTransaction.status === "SUCCESS") return null;

    if (lockedTransaction.purpose === "CROWDFUND_JOIN") {
      await reserveEqubSlot({
        challengeId: lockedTransaction.targetId,
        userId: lockedTransaction.userId,
        paymentRef: lockedTransaction.txRef,
        session,
      });
    }

    if (lockedTransaction.purpose === "DIRECT_PURCHASE") {
      await fulfillDirectPurchase({
        transaction: lockedTransaction,
        email: email || chapaPayment?.email || chapaPayment?.customer_email,
        session,
      });
    }

    lockedTransaction.status = "SUCCESS";
    lockedTransaction.chapaReference = chapaPayment?.reference || chapaPayment?.chapa_reference || null;
    lockedTransaction.failureReason = null;
    lockedTransaction.processedAt = new Date();
    await lockedTransaction.save({ session });

    return lockedTransaction;
  });
};

export const initializePayment = async (req, res) => {
  try {
    const { userId, amount, email, firstName, purpose, targetId } = req.body;

    if (!process.env.CHAPA_SECRET_KEY) {
      return res.status(500).json({ message: "Payment gateway is not configured." });
    }

    if (!userId || !amount || !email || !firstName || !purpose || !targetId) {
      return res.status(400).json({ message: "userId, amount, email, firstName, purpose, and targetId are required." });
    }

    if (!PURPOSES.includes(purpose)) {
      return res.status(400).json({ message: "Invalid payment purpose." });
    }

    if (!mongoose.Types.ObjectId.isValid(userId) || !mongoose.Types.ObjectId.isValid(targetId)) {
      return res.status(400).json({ message: "userId and targetId must be valid ObjectIds." });
    }

    const numericAmount = Number(amount);
    if (!Number.isFinite(numericAmount) || numericAmount < 1) {
      return res.status(400).json({ message: "amount must be a number greater than 0." });
    }

    const user = await User.findById(userId).select("name email").lean();
    if (!user) return res.status(404).json({ message: "User not found." });

    if (purpose === "DIRECT_PURCHASE") {
      const resolvedProduct = await findPurchasableProduct(targetId);
      if (!resolvedProduct) return res.status(404).json({ message: "Product was not found or is not approved." });
      if (!moneyMatches(resolvedProduct.product.price, numericAmount)) {
        return res.status(400).json({ message: "Payment amount does not match the product price." });
      }
    }

    if (purpose === "CROWDFUND_JOIN") {
      const challenge = await EqubChallenge.findOne({ _id: targetId, status: "PENDING", expiresAt: { $gt: new Date() } }).lean();
      if (!challenge) return res.status(404).json({ message: "Challenge was not found or is no longer active." });
      if (!moneyMatches(challenge.slotPrice, numericAmount)) {
        return res.status(400).json({ message: "Payment amount does not match the challenge slot price." });
      }
      if (challenge.filledSlots.some((slotUserId) => slotUserId.toString() === userId.toString())) {
        return res.status(409).json({ message: "You already joined this challenge." });
      }
      if (challenge.filledSlots.length >= challenge.totalSlots) {
        return res.status(409).json({ message: "This challenge has no remaining slots." });
      }
    }

    const txRef = `tx-${purpose.toLowerCase()}-${Date.now()}-${crypto.randomBytes(4).toString("hex")}`;
    const returnUrl = `${frontendUrl()}/payment-verify?tx_ref=${encodeURIComponent(txRef)}`;
    const callbackUrl = process.env.CHAPA_CALLBACK_URL?.includes("/api/payments/webhook")
      ? process.env.CHAPA_CALLBACK_URL
      : `${backendUrl()}/api/payments/webhook`;

    const transaction = await Transaction.create({
      userId,
      amount: numericAmount,
      currency: "ETB",
      txRef,
      status: "PENDING",
      purpose,
      targetId,
    });

    const chapaPayload = {
      amount: String(numericAmount),
      currency: "ETB",
      email,
      first_name: firstName,
      last_name: req.body.lastName || "Customer",
      tx_ref: txRef,
      callback_url: callbackUrl,
      return_url: returnUrl,
      customization: {
        title: purpose === "CROWDFUND_JOIN" ? "Join Yegara Equb Challenge" : "Yegara Marketplace Checkout",
        description: purpose === "CROWDFUND_JOIN" ? "Crowdfunding slot purchase" : "Product purchase",
      },
      meta: {
        purpose,
        targetId,
        itemId: purpose === "DIRECT_PURCHASE" ? targetId : undefined,
        challengeId: purpose === "CROWDFUND_JOIN" ? targetId : undefined,
        userId,
      },
    };

    const chapaResponse = await axios.post(CHAPA_INITIALIZE_URL, chapaPayload, {
      headers: {
        Authorization: `Bearer ${process.env.CHAPA_SECRET_KEY}`,
        "Content-Type": "application/json",
      },
      timeout: 20000,
    });

    const checkoutUrl = chapaResponse.data?.data?.checkout_url;
    if (!checkoutUrl) {
      transaction.status = "FAILED";
      transaction.failureReason = "Chapa did not return checkout_url.";
      await transaction.save();
      return res.status(502).json({ message: "Payment gateway did not return a checkout URL." });
    }

    transaction.checkoutUrl = checkoutUrl;
    await transaction.save();

    return res.status(201).json({ checkout_url: checkoutUrl, tx_ref: txRef, transactionId: transaction._id });
  } catch (error) {
    console.error("initializePayment error:", error.response?.data || error.message);
    return res.status(error.status || 500).json({
      message: error.response?.data?.message || error.message || "Unable to initialize payment.",
    });
  }
};

export const chapaWebhook = async (req, res) => {
  try {
    if (!verifyWebhookSignature(req)) {
      return res.status(401).json({ message: "Invalid Chapa webhook signature." });
    }

    const { status, tx_ref: txRef, meta } = req.body;
    if (!txRef) return res.status(400).json({ message: "Missing tx_ref." });

    const transaction = await Transaction.findOne({ txRef });
    if (!transaction) return res.status(404).json({ message: "Transaction not found." });

    if (status !== "success") {
      transaction.status = "FAILED";
      transaction.failureReason = `Chapa webhook status: ${status || "unknown"}`;
      await transaction.save();
      return res.status(200).json({ message: "Payment status recorded." });
    }

    const chapaPayment = await verifyChapaTransaction(txRef);
    if (chapaPayment?.status !== "success") {
      return res.status(400).json({ message: "Payment could not be verified with Chapa." });
    }

    if (Number(chapaPayment.amount) !== Number(transaction.amount) || chapaPayment.currency !== transaction.currency) {
      return res.status(400).json({ message: "Verified payment amount or currency does not match the transaction." });
    }

    const webhookPurpose = meta?.purpose || transaction.purpose;
    if (webhookPurpose !== transaction.purpose) {
      return res.status(400).json({ message: "Webhook purpose does not match the transaction record." });
    }

    await processSuccessfulTransaction({ transaction, chapaPayment, email: req.body.email });
    return res.status(200).json({ message: "Webhook processed successfully." });
  } catch (error) {
    console.error("chapaWebhook error:", error.response?.data || error.message);
    return res.status(error.status || 500).json({ message: error.message || "Webhook processing failed." });
  }
};

export const verifyPaymentStatus = async (req, res) => {
  try {
    const txRef = req.params.txRef || req.query.tx_ref;
    if (!txRef) return res.status(400).json({ message: "tx_ref is required." });
    if (!process.env.CHAPA_SECRET_KEY) return res.status(500).json({ message: "Payment gateway is not configured." });

    const transaction = await Transaction.findOne({ txRef });
    if (!transaction) return res.status(404).json({ message: "Transaction not found." });

    if (transaction.status !== "SUCCESS") {
      const chapaPayment = await verifyChapaTransaction(txRef);

      if (chapaPayment?.status === "success") {
        if (Number(chapaPayment.amount) !== Number(transaction.amount) || chapaPayment.currency !== transaction.currency) {
          return res.status(400).json({ message: "Verified payment amount or currency does not match the transaction." });
        }

        await processSuccessfulTransaction({ transaction, chapaPayment, email: chapaPayment.email || chapaPayment.customer_email });
      } else if (chapaPayment?.status && chapaPayment.status !== "pending") {
        transaction.status = "FAILED";
        transaction.failureReason = `Chapa verification status: ${chapaPayment.status}`;
        await transaction.save();
      }
    }

    const refreshed = await Transaction.findOne({ txRef }).lean();
    return res.status(200).json({
      status: refreshed.status,
      purpose: refreshed.purpose,
      targetId: refreshed.targetId,
      tx_ref: refreshed.txRef,
    });
  } catch (error) {
    console.error("verifyPaymentStatus error:", error.response?.data || error.message);
    return res.status(error.status || 500).json({ message: error.message || "Unable to verify payment status." });
  }
};






