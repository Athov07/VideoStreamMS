import { Subscription } from "../models/subscription.model.js";
import { Profile } from "../models/profile.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { logActivity } from "../utils/logger.js";

export const toggleSubscription = asyncHandler(async (req, res) => {
    const { channelId } = req.params; // The ID of the channel to sub to
    const subscriberUserId = req.user.id; // From JWT

    const subscriberProfile = await Profile.findOne({ userId: subscriberUserId });
    if (!subscriberProfile) throw new ApiError(404, "Your profile not found");

    const existingSub = await Subscription.findOne({
        subscriberId: subscriberProfile._id,
        channelId
    });

    if (existingSub) {
        // Unsubscribe
        await Subscription.findByIdAndDelete(existingSub._id);
        await Profile.findByIdAndUpdate(channelId, { $inc: { subscriberCount: -1 } });
        await logActivity(subscriberUserId, 'UNSUBSCRIBED', channelId, "Unfollowed channel");
        return res.status(200).json({ success: true, message: "Unsubscribed" });
    }

    // Subscribe
    const newSub = await Subscription.create({
        subscriberId: subscriberProfile._id,
        channelId
    });
    await Profile.findByIdAndUpdate(channelId, { $inc: { subscriberCount: 1 } });
    await logActivity(subscriberUserId, 'SUBSCRIBED', channelId, "Followed channel");

    res.status(201).json({ success: true, data: newSub });
});

export const getChannelSubscribers = asyncHandler(async (req, res) => {
    const { channelId } = req.params;
    
    // Get all subs and populate the subscriber profile details
    const subscribers = await Subscription.find({ channelId })
        .populate("subscriberId", "username avatar");

    res.status(200).json({ success: true, data: subscribers });
});