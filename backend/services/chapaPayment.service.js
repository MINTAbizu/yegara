import mongoose from "mongoose";
import EqubChallenge from "../models/EqubChallenge.model.js";
import { settleEqubChallengeIfReady } from "./equbSettlement.service.js";
import Order from "../model/Order/Order.js";
import Book from "../model/Book/Book.model.js";
import DigitalProduct from "../model/digitalproducts/digital products.js";
import PhysicalProduct from "../model/physicalproduct/physicalprosuct.model.js";
import GiftProduct from "../model/giftproduct/giftproduct.js";

const productSources = [
  { model: Book, productModel: "DigitalProduct", productType: "book", sellerField: "seller" },
  { model: DigitalProduct, productModel: "Product", productType: "digital", sellerField: "seller" },
  { model: PhysicalProduct, productModel: "PhysicalProduct", productType: "physical", sellerField: "seller" },
  { model: GiftProduct, productModel: "giftproduct", productType: "gift", sellerField: "seller" },
];

export const reserveEqubSlot = async ({ challengeId, userId, paymentRef, session }) => {
  const challenge = await EqubChallenge.findOne({
    _id: challengeId,
    status: "PENDING",
    expiresAt: { $gt: new Date() },
  }).session(session);

  if (!challenge) {
    throw Object.assign(new Error("This challenge is no longer active or was not found."), { status: 400 });
  }

  const alreadyJoined = challenge.filledSlots.some((slotUserId) => slotUserId.toString() === userId.toString());
  if (alreadyJoined) return challenge;

  if (challenge.filledSlots.length >= challenge.totalSlots) {
    throw Object.assign(new Error("This challenge has no remaining slots."), { status: 409 });
  }

  challenge.filledSlots.push(userId);
  challenge.paymentRef = paymentRef || challenge.paymentRef;
  await challenge.save({ session });

  if (challenge.filledSlots.length >= challenge.totalSlots) {
    return settleEqubChallengeIfReady(challenge._id, session);
  }

  return challenge;
};

export const findPurchasableProduct = async (targetId) => {
  for (const source of productSources) {
    const product = await source.model.findOne({ _id: targetId, status: "approved" }).session(null);
    if (product) return { product, ...source };
  }

  return null;
};

export const fulfillDirectPurchase = async ({ transaction, email, session }) => {
  const existingOrder = await Order.findOne({ tx_ref: transaction.txRef }).session(session);
  if (existingOrder) {
    if (existingOrder.status !== "paid") {
      existingOrder.status = "paid";
      await existingOrder.save({ session });
    }
    return existingOrder;
  }

  let resolvedProduct = null;
  for (const source of productSources) {
    const product = await source.model.findOne({ _id: transaction.targetId, status: "approved" }).session(session);
    if (product) {
      resolvedProduct = { product, ...source };
      break;
    }
  }

  if (!resolvedProduct) {
    throw Object.assign(new Error("Purchased product was not found or is not approved."), { status: 404 });
  }

  const { product, productModel, productType, sellerField } = resolvedProduct;

  return Order.create(
    [
      {
        product: product._id,
        productModel,
        productType,
        buyerId: transaction.userId,
        buyerEmail: email || "unknown@yegara.local",
        sellerId: product[sellerField],
        amount: transaction.amount,
        status: "paid",
        tx_ref: transaction.txRef,
      },
    ],
    { session }
  ).then(([order]) => order);
};

export const withMongoTransaction = async (work) => {
  const session = await mongoose.startSession();

  try {
    let result;
    await session.withTransaction(async () => {
      result = await work(session);
    });
    return result;
  } finally {
    await session.endSession();
  }
};
