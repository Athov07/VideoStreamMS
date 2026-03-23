import { Subscription } from "../models/subscription.model.js";
import { Profile } from "../models/profile.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { logActivity } from "../utils/logger.js";
import mongoose from "mongoose";


export const toggleSubscription = asyncHandler(async (req, res) => {
    const { channelId } = req.params; 
    const subscriberUserId = req.user.id; 

    const myProfile = await Profile.findOne({ userId: subscriberUserId });
    const targetProfile = await Profile.findOne({ userId: channelId });

    if (!myProfile || !targetProfile) {
        throw new ApiError(404, "Profile not found");
    }

    if (myProfile._id.equals(targetProfile._id)) {
        throw new ApiError(400, "You cannot subscribe to yourself");
    }

    const existingSub = await Subscription.findOne({
        subscriberId: myProfile._id,
        channelId: targetProfile._id
    });

    if (existingSub) {
        await Subscription.findByIdAndDelete(existingSub._id);
        
        targetProfile.subscriberCount = Math.max(0, targetProfile.subscriberCount - 1);
        await targetProfile.save();

        await logActivity(
            subscriberUserId, 
            'UNSUBSCRIBED', 
            channelId, 
            `User ${myProfile.username} unfollowed ${targetProfile.username}`
        );

        return res.status(200).json({ success: true, message: "Unsubscribed" });
    }

    await Subscription.create({
        subscriberId: myProfile._id,
        channelId: targetProfile._id
    });
    
    targetProfile.subscriberCount += 1;
    await targetProfile.save();

    await logActivity(
        subscriberUserId, 
        'SUBSCRIBED', 
        channelId, 
        `User ${myProfile.username} followed ${targetProfile.username}`
    );

    res.status(201).json({ success: true, message: "Subscribed successfully" });
});


export const getChannelSubscribers = asyncHandler(async (req, res) => {
    const { channelId } = req.params; 
    
    const currentUserId = req.user?.id || req.user?._id; 

    const targetProfile = await Profile.findOne({ userId: channelId });
    if (!targetProfile) throw new ApiError(404, "Profile not found");

    const isMe = currentUserId ? String(currentUserId) === String(channelId) : false;

    console.log("COMPARING:", { 
        fromToken: currentUserId, 
        fromUrl: channelId, 
        match: isMe 
    });

    let isSubscribedByMe = false;
    if (!isMe && currentUserId) {
        const myProfile = await Profile.findOne({ userId: currentUserId });
        if (myProfile) {
            const sub = await Subscription.findOne({
                subscriberId: myProfile._id,
                channelId: targetProfile._id
            });
            isSubscribedByMe = !!sub;
        }
    }

    res.status(200).json({
        success: true,
        data: {
            ...targetProfile._doc,
            isMe,
            isSubscribedByMe
        }
    });
});