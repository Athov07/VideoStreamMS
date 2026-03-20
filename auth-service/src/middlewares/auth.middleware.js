import jwt from "jsonwebtoken";
import ApiError from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import User from "../models/user.model.js";

const authMiddleware = asyncHandler(async (req, res, next) => {
    const token = req.cookies?.accessToken || req.headers.authorization?.split(" ")[1];

    if (!token) {
        throw new ApiError(401, "Unauthorized: No token provided");
    }

    try {
        const decodedToken = jwt.verify(token, process.env.JWT_ACCESS_SECRET);

        const user = await User.findById(decodedToken.id).select("-refreshToken");

        if (!user) {
            throw new ApiError(401, "Invalid Access Token: User not found");
        }

        req.user = user;
        next();
    } catch (error) {
        if (error.name === "TokenExpiredError") {
            throw new ApiError(401, "Access token has expired. Please refresh.");
        }
        throw new ApiError(401, error?.message || "Invalid Access Token");
    }
});


export const authorizeRoles = (...roles) => {
    return (req, res, next) => {
        if (!roles.includes(req.user.role)) {
            throw new ApiError(
                403, 
                `Role: ${req.user.role} is not allowed to access this resource`
            );
        }
        next();
    };
};

export default authMiddleware;