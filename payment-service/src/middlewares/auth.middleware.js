import dotenv from "dotenv";
dotenv.config();
import jwt from "jsonwebtoken";
import { ApiError } from "../utils/ApiError.js";

export const verifyJWT = (req, res, next) => {
  try {
    const token =
      req.cookies?.accessToken ||
      req.header("Authorization")?.replace("Bearer ", "");

    if (!token) {
      return res.status(401).json({ message: "Unauthorized request" });
    }

    const decodedToken = jwt.verify(
      token,
      process.env.JWT_ACCESS_SECRET
    );

    req.user = decodedToken;
    next();
  } catch (error) {
    console.error("JWT ERROR:", error.message);

    return res.status(401).json({
      message: "Invalid or expired access token",
    });
  }
};