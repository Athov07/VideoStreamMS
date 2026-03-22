import { Subscription } from "../models/subscription.model.js";
import { Profile } from "../models/profile.model.js";
import { logActivity } from "../utils/logger.js"; 
import { ApiError } from "../utils/ApiError.js";

export const subscriptionService = {
  subscribe: async (subscriberUserId, channelId) => {
    const subscriberProfile = await Profile.findOne({
      userId: subscriberUserId,
    });

    if (!subscriberProfile) {
        throw new ApiError(404, "Subscriber profile not found");
    }

    const existing = await Subscription.findOne({
      subscriberId: subscriberProfile._id,
      channelId,
    });

    if (existing) throw new ApiError(400, "Already subscribed to this channel");

    const sub = await Subscription.create({
      subscriberId: subscriberProfile._id,
      channelId,
    });

    await Profile.findByIdAndUpdate(channelId, {
      $inc: { subscriberCount: 1 },
    });

    // Requirement 5: Audit Log for Subscription
    await logActivity(
        subscriberUserId, 
        'SUBSCRIBED', 
        channelId, 
        `User subscribed to channel ${channelId}`
    );

    return sub;
  },

  unsubscribe: async (subscriberUserId, channelId) => {
    const subscriberProfile = await Profile.findOne({
      userId: subscriberUserId,
    });

    if (!subscriberProfile) {
        throw new ApiError(404, "Subscriber profile not found");
    }

    const result = await Subscription.findOneAndDelete({
      subscriberId: subscriberProfile._id,
      channelId,
    });

    if (result) {
      await Profile.findByIdAndUpdate(channelId, {
        $inc: { subscriberCount: -1 },
      });

      // Requirement 5: Audit Log for Unsubscription
      await logActivity(
          subscriberUserId, 
          'UNSUBSCRIBED', 
          channelId, 
          `User unsubscribed from channel ${channelId}`
      );
    }
    
    return result;
  },

  // Added logic for Requirement 1: Get all subscribers
  getSubscribers: async (channelId) => {
      return await Subscription.find({ channelId })
          .populate("subscriberId", "username avatar");
  }
};