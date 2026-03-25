import dotenv from "dotenv";
dotenv.config();
import { Plan } from "../models/plan.model.js";
import { Subscription } from "../models/subscription.model.js";
import * as paymentService from "../services/payment.service.js";
import { ApiError } from "../utils/ApiError.js";

export const checkout = async (req, res) => {
  const { planId } = req.body;
  const plan = await Plan.findById(planId);
  if (!plan) throw new ApiError(404, "Plan not found");

  const order = await paymentService.createRazorpayOrder(plan.price);
  res
    .status(200)
    .json({
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

  if (!isValid) throw new ApiError(400, "Invalid signature, payment failed");

  const plan = await Plan.findById(planId);
  const expiryDate = new Date();
  expiryDate.setDate(expiryDate.getDate() + plan.durationInDays);

  const subscription = await Subscription.create({
    userId,
    planId,
    expiryDate,
    status: "active",
  });

  res
    .status(200)
    .json({ success: true, message: "Subscription activated", subscription });
};
