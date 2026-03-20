import jwt from "jsonwebtoken";
import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";

export const verifyJWT = asyncHandler(async (req, res, next) => {
    try {
        const token = req.header("Authorization")?.replace("Bearer ", "");

        if (!token) {
            throw new ApiError(401, "Unauthorized request - No token provided");
        }

        const decodedToken = jwt.verify(token, process.env.JWT_ACCESS_SECRET);

        // Standardize the ID: Support both '_id' and 'id' from the token
        const userId = decodedToken._id || decodedToken.id;

        if (!userId) {
            throw new ApiError(401, "Invalid token payload: User ID missing");
        }

        // Attach standardized user object to request
        req.user = {
            ...decodedToken,
            _id: userId 
        };
        
        console.log(" Authenticated User ID:", req.user._id);
        next();
    } catch (error) {
        throw new ApiError(401, error?.message || "Invalid access token");
    }
});