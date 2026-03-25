import dotenv from "dotenv";
dotenv.config();
import { Plan } from "../models/plan.model.js";
import { Subscription } from "../models/subscription.model.js";
import * as paymentService from "../services/payment.service.js";
import { ApiError } from "../utils/ApiError.js";
import { AuditLog } from "../models/auditLog.model.js";
import logger from "../utils/logger.js";

export const checkout = async (req, res) => {
  const { planId } = req.body;
  const plan = await Plan.findById(planId);
  if (!plan) throw new ApiError(404, "Plan not found");

  const order = await paymentService.createRazorpayOrder(plan.price);

  // --- Audit Log ---
  await AuditLog.create({
    action: "CHECKOUT_INITIATED",
    actorId: req.user.id,
    details: { planId, amount: plan.price, orderId: order.id },
    ipAddress: req.ip,
  });
  logger.info(`Checkout initiated by user ${req.user.id} for plan ${planId}`);
  res.status(200).json({
    success: true,
    order,
    plan,
    razorpay_key: process.env.RAZORPAY_KEY_ID,
  });
};

export const verifyPayment = async (req, res) => {
  const { razorpay_order_id, razorpay_payment_id, razorpay_signature, planId } =
    req.body;
  const userId = req.user.id;
  // await User.findByIdAndUpdate(userId, { isPremium: true });

  const isValid = paymentService.verifyRazorpaySignature(
    razorpay_order_id,
    razorpay_payment_id,
    razorpay_signature,
  );

  if (!isValid) {
    // --- Audit Log for Failure ---
    await AuditLog.create({
      action: "PAYMENT_VERIFICATION_FAILED",
      actorId: userId,
      details: { razorpay_order_id, planId },
      ipAddress: req.ip,
    });
    logger.error(
      `Payment verification failed for user ${userId} on order ${razorpay_order_id}`,
    );
    throw new ApiError(400, "Invalid signature, payment failed");
  }

  const plan = await Plan.findById(planId);
  const expiryDate = new Date();
  expiryDate.setDate(expiryDate.getDate() + plan.durationInDays);

  const subscription = await Subscription.create({
    userId,
    planId,
    expiryDate,
    status: "active",
  });
  // --- Audit Log for Success ---
  await AuditLog.create({
    action: "SUBSCRIPTION_ACTIVATED",
    actorId: userId,
    details: {
      subscriptionId: subscription._id,
      planId,
      expiryDate,
      razorpay_payment_id,
    },
    ipAddress: req.ip,
  });
  logger.info(`Subscription ${subscription._id} activated for user ${userId}`);
  res
    .status(200)
    .json({ success: true, message: "Subscription activated", subscription });
};
