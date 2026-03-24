import { Profile } from "../models/profile.model.js";
import { Subscription } from "../models/subscription.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";

// --- Profile Management ---

export const getAllProfiles = asyncHandler(async (req, res) => {
    const profiles = await Profile.find().sort({ createdAt: -1 });
    
    res.status(200).json({
        success: true,
        data: profiles
    });
});

export const updateProfileByAdmin = asyncHandler(async (req, res) => {
    const { profileId } = req.params;
    const { username, bio } = req.body;

    const profile = await Profile.findByIdAndUpdate(
        profileId,
        { $set: { username, bio } },
        { new: true }
    );

    if (!profile) throw new ApiError(404, "Profile not found");

    res.status(200).json({ success: true, data: profile });
});

// --- Subscription Management ---

export const getSubscriptionStats = asyncHandler(async (req, res) => {
    // Get total system-wide subscriptions for the Admin Dashboard
    const totalSubscriptions = await Subscription.countDocuments();
    
    res.status(200).json({
        success: true,
        total: totalSubscriptions
    });
});

export const removeSubscriberByAdmin = asyncHandler(async (req, res) => {
    const { subscriptionId } = req.params;

    const sub = await Subscription.findByIdAndDelete(subscriptionId);
    if (!sub) throw new ApiError(404, "Subscription record not found");

    // Decrement the channel's subscriber count
    await Profile.findByIdAndUpdate(sub.channelId, {
        $inc: { subscriberCount: -1 }
    });

    res.status(200).json({ success: true, message: "Subscription removed by admin" });
});