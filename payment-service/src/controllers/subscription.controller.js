import * as subService from "../services/subscription.service.js";
import { asyncHandler } from "../utils/asyncHandler.js";

export const checkStatus = asyncHandler(async (req, res) => {
    const subscription = await subService.getUserSubscriptionStatus(req.user.id);
    res.status(200).json({
        success: true,
        isPremium: !!subscription,
        subscription
    });
});