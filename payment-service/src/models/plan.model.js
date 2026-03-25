import mongoose from "mongoose";

const planSchema = new mongoose.Schema({
  name: { type: String, required: true }, // e.g., "Monthly Pro"
  description: String,
  price: { type: Number, required: true },
  currency: { type: String, default: "INR" },
  durationInDays: { type: Number, required: true }, // e.g., 30
  isActive: { type: Boolean, default: true }
}, { timestamps: true });

export const Plan = mongoose.model("Plan", planSchema);