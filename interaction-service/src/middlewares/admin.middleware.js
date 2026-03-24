import ApiError from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";

export const isAdmin = asyncHandler(async (req, res, next) => {
    // 1. Check if user exists (should be attached by verifyJWT)
    if (!req.user) {
        throw new ApiError(401, "Unauthorized request: Authentication required");
    }

    // 2. Validate role
    if (!req.user.role || req.user.role !== 'admin') {
        throw new ApiError(
            403, 
            "Access Denied: Admin privileges required to perform this action"
        );
    }

    // 3. Authorized - move to the next middleware or controller
    next();
});