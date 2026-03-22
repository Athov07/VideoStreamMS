import jwt from "jsonwebtoken";
import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";

export const verifyJWT = asyncHandler(async (req, res, next) => {
    // 1. Extract token from Header or Cookies
    const token = req.cookies?.accessToken || req.headers.authorization?.split(" ")[1];

    if (!token) {
        throw new ApiError(401, "No token provided");
    }

    try {
        // 2. Verify using the SHARED secret
        const decodedToken = jwt.verify(token, process.env.JWT_ACCESS_SECRET);

        // 3. ATTACH THE PAYLOAD DIRECTLY
        // This contains id, username, email, role because you added them in auth-service
        req.user = decodedToken; 
        
        next();
    } catch (error) {
        throw new ApiError(401, "Invalid Access Token");
    }
});