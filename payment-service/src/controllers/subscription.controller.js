import * as subService from "../services/subscription.service.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import logger from "../utils/logger.js";

export const checkStatus = asyncHandler(async (req, res) => {
  const subscription = await subService.getUserSubscriptionStatus(req.user.id);
//   logger.info(
//     `Subscription status check for user ${req.user.id} - Premium: ${!!subscription}`,
//   );
  res.status(200).json({
    success: true,
    isPremium: !!subscription,
    subscription,
  });
});
