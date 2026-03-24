import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";

export const isAdmin = asyncHandler(async (req, res, next) => {
    console.log("Admin Check for user:", req.user?._id);
    console.log("Role:", req.user?.role);
    if (!req.user) {
        throw new ApiError(401, "Unauthorized request: No user found");
    }

    if (req.user.role !== 'admin') {
        throw new ApiError(403, "Access Denied: Admin privileges required");
    }

    next();
});