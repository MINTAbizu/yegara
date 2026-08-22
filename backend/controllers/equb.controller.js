import axios from "axios";
import mongoose from "mongoose";
import EqubChallenge from "../models/EqubChallenge.model.js";
import PhysicalProduct from "../model/physicalproduct/physicalprosuct.model.js";
import DigitalProduct from "../model/digitalproducts/digital products.js";
import GiftProduct from "../model/giftproduct/giftproduct.js";
import BookProduct from "../model/Book/Book.model.js";
import Profile from "../model/UserProfile/UserProfile.js";
import { settleEqubChallengeIfReady } from "../services/equbSettlement.service.js";

const FUNDING_TYPES = ["FLEXIBLE", "PRODUCT_LOCKED"];
const PRODUCT_TYPES = {
  physical: { model: PhysicalProduct, modelName: "PhysicalProduct", nameField: "productName" },
  digital: { model: DigitalProduct, modelName: "Product", nameField: "productName" },
  gift: { model: GiftProduct, modelName: "giftproduct", nameField: "productName" },
  book: { model: BookProduct, modelName: "DigitalProduct", nameField: "bookName" },
};
const productFields = "productName bookName price image status seller";
const userFields = "name email";

const isAdmin = (user) => user?.role === "admin";
const isApprovedSeller = async (user) => {
  if (!user) return false;
  if (user.kycSubmitted || ["seller", "pro", "admin"].includes(user.role)) return true;
  const profile = await Profile.findOne({ user: user._id || user.id, status: "approved" }).select("_id").lean();
  return Boolean(profile);
};

const normalizeProduct = (product, productType, config) => ({
  _id: product._id,
  productId: product._id,
  productType,
  productModel: config.modelName,
  productName: product[config.nameField] || product.productName || product.bookName || "Untitled product",
  price: product.price || 0,
  image: product.image || null,
  seller: product.seller || null,
});

export const createEqubChallenge = async (req, res) => {
  const userId = req.user?._id || req.user?.id;
  const { title, description, fundingType = "FLEXIBLE", productId, productType = "physical", totalSlots, slotPrice, expiresAt } = req.body;

  if (!userId) {
    return res.status(401).json({ message: "Authentication required." });
  }

  if (!title || !description || !totalSlots || !slotPrice || !expiresAt) {
    return res.status(400).json({ message: "title, description, totalSlots, slotPrice, and expiresAt are required." });
  }

  const normalizedFundingType = FUNDING_TYPES.includes(fundingType) ? fundingType : "FLEXIBLE";
  const parsedSlots = Number(totalSlots);
  const parsedPrice = Number(slotPrice);
  const expiryDate = new Date(expiresAt);

  if (!Number.isInteger(parsedSlots) || parsedSlots < 1) {
    return res.status(400).json({ message: "totalSlots must be a whole number greater than 0." });
  }

  if (!Number.isFinite(parsedPrice) || parsedPrice < 1) {
    return res.status(400).json({ message: "slotPrice must be a number greater than 0." });
  }

  if (Number.isNaN(expiryDate.getTime()) || expiryDate <= new Date()) {
    return res.status(400).json({ message: "expiresAt must be a future date." });
  }

  if (normalizedFundingType === "FLEXIBLE" && !isAdmin(req.user)) {
    return res.status(403).json({ message: "Only admins can create general crowdfunding challenges." });
  }

  if (normalizedFundingType === "PRODUCT_LOCKED" && isAdmin(req.user)) {
    return res.status(403).json({ message: "Admins create general crowdfunding only. Product-locked billing belongs to approved sellers." });
  }

  if (normalizedFundingType === "PRODUCT_LOCKED") {
    if (!productId) {
      return res.status(400).json({ message: "An approved productId is required for crowdfunding billing challenges." });
    }

    if (!(await isApprovedSeller(req.user))) {
      return res.status(403).json({ message: "Only approved sellers can create crowdfunding billing challenges." });
    }
  }

  try {
    let product = null;
    const productConfig = PRODUCT_TYPES[productType];

    if (productId) {
      if (!productConfig) {
        return res.status(400).json({ message: "Invalid productType." });
      }

      if (!mongoose.Types.ObjectId.isValid(productId)) {
        return res.status(400).json({ message: "Invalid productId." });
      }

      const productQuery = { _id: productId, status: "approved" };
      if (!isAdmin(req.user)) productQuery.seller = userId;

      product = await productConfig.model.findOne(productQuery).lean();
      if (!product) {
        return res.status(404).json({ message: "Selected approved product was not found for this seller." });
      }
    }

    const challenge = await EqubChallenge.create({
      title: title.trim(),
      description: description.trim(),
      fundingType: normalizedFundingType,
      productType: product ? productType : null,
      productModel: product ? productConfig.modelName : "PhysicalProduct",
      productId: product?._id || null,
      productSnapshot: {
        name: product ? normalizeProduct(product, productType, productConfig).productName : null,
        price: product?.price ?? null,
        image: product?.image || null,
      },
      creatorId: userId,
      vendorId: product?.seller || userId,
      totalSlots: parsedSlots,
      slotPrice: parsedPrice,
      filledSlots: [],
      expiresAt: expiryDate,
      status: "PENDING",
      winnerRedemption: {
        type: normalizedFundingType === "PRODUCT_LOCKED" ? "PRODUCT_CHECKOUT" : "MARKETPLACE_CREDIT",
        amount: parsedSlots * parsedPrice,
        productType: normalizedFundingType === "PRODUCT_LOCKED" ? productType : null,
        productModel: normalizedFundingType === "PRODUCT_LOCKED" ? productConfig.modelName : "PhysicalProduct",
        productId: normalizedFundingType === "PRODUCT_LOCKED" ? product._id : null,
        status: "NOT_READY",
      },
    });

    return res.status(201).json({ message: "Crowdfunded challenge created successfully.", challenge });
  } catch (error) {
    console.error("createEqubChallenge error:", error);
    return res.status(500).json({ message: error?.message || "Unable to create crowdfunded challenge." });
  }
};

export const getBillingProducts = async (req, res) => {
  const userId = req.user?._id || req.user?.id;

  if (!userId) {
    return res.status(401).json({ message: "Authentication required." });
  }

  if (!(await isApprovedSeller(req.user))) {
    return res.status(403).json({ message: "Only approved sellers can use crowdfunding billing." });
  }

  try {
    const baseQuery = { status: "approved" };
    const query = isAdmin(req.user) ? baseQuery : { ...baseQuery, seller: userId };
    const entries = await Promise.all(
      Object.entries(PRODUCT_TYPES).map(async ([type, config]) => {
        const products = await config.model.find(query).select(productFields).populate("seller", userFields).sort({ createdAt: -1 }).lean();
        return products.map((product) => normalizeProduct(product, type, config));
      })
    );

    return res.status(200).json(entries.flat());
  } catch (error) {
    console.error("getBillingProducts error:", error);
    return res.status(500).json({ message: error?.message || "Unable to fetch billing products." });
  }
};

export const getAllChallengesAdmin = async (req, res) => {
  if (!isAdmin(req.user)) {
    return res.status(403).json({ message: "Admin only" });
  }

  try {
    const challenges = await EqubChallenge.find()
      .populate("creatorId", userFields)
      .populate("vendorId", userFields)
      .populate("productId", productFields)
      .populate("filledSlots", userFields)
      .populate("winnerId", userFields)
      .sort({ createdAt: -1 });

    return res.status(200).json(challenges);
  } catch (error) {
    console.error("getAllChallengesAdmin error:", error);
    return res.status(500).json({ message: error?.message || "Unable to fetch crowdfunding challenges." });
  }
};

export const getActiveChallenges = async (req, res) => {
  try {
    const challenges = await EqubChallenge.find({ status: "PENDING", expiresAt: { $gt: new Date() } })
      .populate("creatorId", userFields)
      .populate("vendorId", userFields)
      .populate("productId", productFields)
      .populate("filledSlots", userFields)
      .sort({ createdAt: -1 })
      .limit(12);

    return res.status(200).json(Array.isArray(challenges) ? challenges : []);
  } catch (error) {
    console.error("getActiveChallenges error:", error);
    return res.status(500).json({ message: error?.message || "Unable to fetch active challenges.", challenges: [] });
  }
};

export const getEqubChallengeById = async (req, res) => {
  const { challengeId } = req.params;

  if (!mongoose.Types.ObjectId.isValid(challengeId)) {
    return res.status(400).json({ message: "Invalid challengeId." });
  }

  try {
    const challenge = await EqubChallenge.findById(challengeId)
      .populate("creatorId", userFields)
      .populate("vendorId", userFields)
      .populate("productId", productFields)
      .populate("filledSlots", userFields)
      .populate("winnerId", userFields);

    if (!challenge) {
      return res.status(404).json({ message: "Challenge was not found." });
    }

    return res.status(200).json(challenge);
  } catch (error) {
    console.error("getEqubChallengeById error:", error);
    return res.status(500).json({ message: error?.message || "Unable to fetch challenge." });
  }
};

export const initializeEqubPayment = async (req, res) => {
  const userId = req.user?._id || req.user?.id;
  const { challengeId, returnUrl } = req.body;

  if (!userId) {
    return res.status(401).json({ message: "Authentication required." });
  }

  if (!challengeId || !mongoose.Types.ObjectId.isValid(challengeId)) {
    return res.status(400).json({ message: "Valid challengeId is required." });
  }

  if (!process.env.CHAPA_SECRET_KEY) {
    return res.status(500).json({ message: "Payment gateway is not configured." });
  }

  try {
    const challenge = await EqubChallenge.findOne({
      _id: challengeId,
      status: "PENDING",
      expiresAt: { $gt: new Date() },
    }).lean();

    if (!challenge) {
      return res.status(404).json({ message: "This challenge is no longer active." });
    }

    const participantIds = challenge.filledSlots.map((id) => id.toString());
    if (participantIds.includes(userId.toString())) {
      return res.status(409).json({ message: "You already joined this challenge." });
    }

    if (challenge.filledSlots.length >= challenge.totalSlots) {
      return res.status(409).json({ message: "This challenge has no remaining slots." });
    }

    const txRef = `equb_${challenge._id}_${userId}_${Date.now()}`;
    const userName = req.user?.name || "Yegara User";
    const [firstName, ...lastNameParts] = userName.split(" ");
    const callbackUrl = returnUrl || `${req.protocol}://${req.get("host")}/equb/payment-callback`;
    const callbackWithParams = `${callbackUrl}?challengeId=${challenge._id}&tx_ref=${txRef}`;

    const paymentData = {
      amount: challenge.slotPrice,
      currency: "ETB",
      email: req.user?.email,
      tx_ref: txRef,
      first_name: firstName || "Yegara",
      last_name: lastNameParts.join(" ") || "Customer",
      title: `Join Equb Challenge: ${challenge.title}`,
      description: `Slot Price: ${challenge.slotPrice} ETB`,
      callback_url: callbackWithParams,
      return_url: callbackWithParams,
      meta: {
        challengeId: challenge._id.toString(),
        userId: userId.toString(),
      },
    };

    const chapaRes = await axios.post(
      "https://api.chapa.co/v1/transaction/initialize",
      paymentData,
      {
        headers: {
          Authorization: `Bearer ${process.env.CHAPA_SECRET_KEY}`,
          "Content-Type": "application/json",
        },
        timeout: 20000,
      }
    );

    const checkoutUrl = chapaRes.data?.data?.checkout_url;
    if (!checkoutUrl) {
      return res.status(502).json({ message: "Payment gateway did not return a checkout URL." });
    }

    return res.status(200).json({ checkout_url: checkoutUrl, tx_ref: txRef });
  } catch (error) {
    console.error("initializeEqubPayment error:", error.response?.data || error.message);
    return res.status(502).json({
      message: error.response?.data?.message || "Unable to start payment. Please try again.",
    });
  }
};

export const verifyEqubPayment = async (req, res) => {
  const userId = req.user?._id || req.user?.id;
  const { challengeId, tx_ref: txRef } = req.body;

  if (!userId) {
    return res.status(401).json({ message: "Authentication required." });
  }

  if (!txRef || !challengeId || !mongoose.Types.ObjectId.isValid(challengeId)) {
    return res.status(400).json({ message: "challengeId and tx_ref are required." });
  }

  if (!process.env.CHAPA_SECRET_KEY) {
    return res.status(500).json({ message: "Payment gateway is not configured." });
  }

  try {
    const chapaRes = await axios.get(
      `https://api.chapa.co/v1/transaction/verify/${txRef}`,
      {
        headers: { Authorization: `Bearer ${process.env.CHAPA_SECRET_KEY}` },
        timeout: 20000,
      }
    );

    const payment = chapaRes.data?.data;
    if (payment?.status !== "success") {
      return res.status(400).json({ message: "Payment was not successful.", payment });
    }

    const session = await mongoose.startSession();
    let challenge;

    try {
      await session.withTransaction(async () => {
        challenge = await EqubChallenge.findOne({
          _id: challengeId,
          status: "PENDING",
          expiresAt: { $gt: new Date() },
        }).session(session);

        if (!challenge) {
          throw Object.assign(new Error("This challenge is no longer active or was not found."), { status: 400 });
        }

        const participantIds = challenge.filledSlots.map((id) => id.toString());
        if (participantIds.includes(userId.toString())) {
          return;
        }

        if (challenge.filledSlots.length >= challenge.totalSlots) {
          throw Object.assign(new Error("This challenge has no remaining slots."), { status: 409 });
        }

        challenge.filledSlots.push(userId);
        challenge.paymentRef = txRef;
        await challenge.save({ session });

        if (challenge.filledSlots.length >= challenge.totalSlots) {
          challenge = await settleEqubChallengeIfReady(challenge._id, session);
        }
      });
    } finally {
      await session.endSession();
    }

    return res.status(200).json({
      message: "Payment confirmed and slot reserved.",
      challenge,
      remainingSlots: challenge.totalSlots - challenge.filledSlots.length,
    });
  } catch (error) {
    console.error("verifyEqubPayment error:", error.response?.data || error.message);
    return res.status(error.status || 502).json({
      message: error.message || "Unable to verify payment.",
    });
  }
};
export const joinEqubChallenge = async (req, res) => {
  const userId = req.user?._id || req.user?.id;
  const { challengeId, paymentRef } = req.body;

  if (!challengeId) {
    return res.status(400).json({ message: "challengeId is required." });
  }

  if (!mongoose.Types.ObjectId.isValid(challengeId)) {
    return res.status(400).json({ message: "Invalid challengeId." });
  }

  if (!userId) {
    return res.status(401).json({ message: "Authentication required." });
  }

  const session = await mongoose.startSession();

  try {
    let challenge;

    await session.withTransaction(async () => {
      challenge = await EqubChallenge.findOne({ _id: challengeId, status: "PENDING", expiresAt: { $gt: new Date() } }).session(session);

      if (!challenge) {
        throw Object.assign(new Error("This challenge is no longer active or was not found."), { status: 400 });
      }

      const participantIds = challenge.filledSlots.map((id) => id.toString());

      if (participantIds.includes(userId.toString())) {
        throw Object.assign(new Error("You already joined this challenge."), { status: 409 });
      }

      if (challenge.filledSlots.length >= challenge.totalSlots) {
        throw Object.assign(new Error("This challenge has no remaining slots."), { status: 409 });
      }

      challenge.filledSlots.push(userId);
      challenge.paymentRef = paymentRef || challenge.paymentRef;
      await challenge.save({ session });

      if (challenge.filledSlots.length >= challenge.totalSlots) {
        challenge = await settleEqubChallengeIfReady(challenge._id, session);
      }
    });

    return res.status(200).json({ message: "Slot reserved successfully.", challenge, remainingSlots: challenge.totalSlots - challenge.filledSlots.length });
  } catch (error) {
    const statusCode = error?.status || 500;
    return res.status(statusCode).json({ message: error?.message || "Unable to process Equb slot reservation." });
  } finally {
    await session.endSession();
  }
};

