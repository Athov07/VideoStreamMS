import jwt from "jsonwebtoken";
import ApiError from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const authMiddleware = asyncHandler(async (req, _, next) => {
    const token = req.cookies?.accessToken || req.headers.authorization?.split(" ")[1];

    if (!token) throw new ApiError(401, "Unauthorized: No token provided");

    try {
        const decodedToken = jwt.verify(token, process.env.JWT_ACCESS_SECRET);
        // Instead of DB call, we attach the decoded payload
        // Ensure your Auth service includes 'id', 'role', and 'username' in the JWT payload
        req.user = decodedToken; 
        next();
    } catch (error) {
        throw new ApiError(401, "Invalid Access Token");
    }
});

export default authMiddleware;