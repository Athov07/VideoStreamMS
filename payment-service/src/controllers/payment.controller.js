import dotenv from "dotenv";
dotenv.config();
import { Plan } from "../models/plan.model.js";
import { Subscription } from "../models/subscription.model.js";
import * as paymentService from "../services/payment.service.js";
import { ApiError } from "../utils/ApiError.js";
import { AuditLog } from "../models/auditLog.model.js";
import logger from "../utils/logger.js";
import { Payment } from "../models/payment.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { emitPaymentEvent } from '../services/kafka.service.js';

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

// export const verifyPayment = async (req, res) => {
//   const { razorpay_order_id, razorpay_payment_id, razorpay_signature, planId } =
//     req.body;
//   const userId = req.user.id;
//   // await User.findByIdAndUpdate(userId, { isPremium: true });

//   const isValid = paymentService.verifyRazorpaySignature(
//     razorpay_order_id,
//     razorpay_payment_id,
//     razorpay_signature,
//   );

//   if (!isValid) {
//     // --- Audit Log for Failure ---
//     await AuditLog.create({
//       action: "PAYMENT_VERIFICATION_FAILED",
//       actorId: userId,
//       details: { razorpay_order_id, planId },
//       ipAddress: req.ip,
//     });
//     logger.error(
//       `Payment verification failed for user ${userId} on order ${razorpay_order_id}`,
//     );
//     throw new ApiError(400, "Invalid signature, payment failed");
//   }

//   const plan = await Plan.findById(planId);
//   const expiryDate = new Date();
//   expiryDate.setDate(expiryDate.getDate() + plan.durationInDays);

//   const subscription = await Subscription.create({
//     userId,
//     planId,
//     expiryDate,
//     status: "active",
//   });
//   // --- Audit Log for Success ---
//   await AuditLog.create({
//     action: "SUBSCRIPTION_ACTIVATED",
//     actorId: userId,
//     details: {
//       subscriptionId: subscription._id,
//       planId,
//       expiryDate,
//       razorpay_payment_id,
//     },
//     ipAddress: req.ip,
//   });
//   logger.info(`Subscription ${subscription._id} activated for user ${userId}`);
//   res
//     .status(200)
//     .json({ success: true, message: "Subscription activated", subscription });
// };

export const verifyPayment = asyncHandler(async (req, res) => {
  const { razorpay_order_id, razorpay_payment_id, razorpay_signature, planId } = req.body;
  const userId = req.user.id;

  // 1. Verify Signature
  const isValid = paymentService.verifyRazorpaySignature(
    razorpay_order_id,
    razorpay_payment_id,
    razorpay_signature
  );

  if (!isValid) {
    await AuditLog.create({
      action: "PAYMENT_VERIFICATION_FAILED",
      actorId: userId,
      details: { razorpay_order_id, planId },
      ipAddress: req.ip,
    });
    throw new ApiError(400, "Invalid signature, payment failed");
  }

  // 2. Fetch Plan (needed for price and expiry duration)
  const plan = await Plan.findById(planId);
  if (!plan) throw new ApiError(404, "Plan not found");

  const expiryDate = new Date();
  expiryDate.setDate(expiryDate.getDate() + plan.durationInDays);

  // 3. Create Subscription (Existing logic)
  const subscription = await Subscription.create({
    userId,
    planId,
    expiryDate,
    status: "active",
  });

  // --- 4. THE MISSING PIECE: Create Payment Record ---
  // This is what the PaymentManager/Admin table actually reads
  await Payment.create({
    userId,
    planId,
    razorpayOrderId: razorpay_order_id,
    razorpayPaymentId: razorpay_payment_id,
    amount: plan.price, // Storing the price here
    status: "success",
  });

  // --- 🔥 KAFKA TRIGGER ---
  // We "shout" to the system that John Doe is now a Premium member
  await emitPaymentEvent('payment-events', {
    userId: userId,
    planId: planId,
    status: 'success',
    expiryDate: expiryDate,
    action: 'UPGRADE_TO_PREMIUM'
  });

  // 5. Audit Log (Existing logic)
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

  logger.info(`Subscription ${subscription._id} and Payment record created for user ${userId}`);

  res.status(200).json({ 
    success: true, 
    message: "Subscription activated and payment recorded", 
    subscription 
  });
});


export const getAllPayments = asyncHandler(async (req, res) => {
    // Populate userId to show Name/Email in the admin table
    const payments = await Payment.find()
        .populate("userId", "name email") 
        .sort({ createdAt: -1 });

    res.status(200).json({
        success: true,
        data: payments
    });
});



