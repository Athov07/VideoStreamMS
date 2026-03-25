import dotenv from 'dotenv';
dotenv.config();
import { razorpayInstance } from "../config/razorpay.js";
import crypto from "crypto";

export const createRazorpayOrder = async (amount) => {
  const options = {
    amount: amount * 100, 
    currency: "INR",
    receipt: `receipt_${Date.now()}`,
  };
  return await razorpayInstance.orders.create(options);
};

export const verifyRazorpaySignature = (orderId, paymentId, signature) => {
  const body = orderId + "|" + paymentId;
  const expectedSignature = crypto
    .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
    .update(body.toString())
    .digest("hex");
  return expectedSignature === signature;
};