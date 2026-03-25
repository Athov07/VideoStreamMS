import { Subscription } from "../models/subscription.model.js";

export const getUserSubscriptionStatus = async (userId) => {
    const subscription = await Subscription.findOne({
        userId,
        status: "active",
        expiryDate: { $gt: new Date() } 
    }).populate("planId");
    
    return subscription;
};