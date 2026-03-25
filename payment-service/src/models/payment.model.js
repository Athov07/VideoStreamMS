import mongoose from "mongoose";

const paymentSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, required: true },
    razorpayOrderId: { type: String, required: true },
    razorpayPaymentId: { type: String },
    razorpaySignature: { type: String },
    amount: { type: Number, required: true },
    status: { 
        type: String, 
        enum: ["pending", "captured", "failed"], 
        default: "pending" 
    },
    planId: { type: mongoose.Schema.Types.ObjectId, ref: "Plan" }
}, { timestamps: true });

export const Payment = mongoose.model("Payment", paymentSchema);