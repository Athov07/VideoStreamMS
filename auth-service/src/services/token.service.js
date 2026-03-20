import jwt from "jsonwebtoken";

export const generateTokens = (user) => {
    // Access Token: Short lived (50m)
    const accessToken = jwt.sign(
        { 
            id: user._id, 
            role: user.role,
            email: user.email 
        },
        process.env.JWT_ACCESS_SECRET,
        { expiresIn: process.env.JWT_ACCESS_EXPIRES }
    );

    // Refresh Token: Long lived (7d)
    const refreshToken = jwt.sign(
        { id: user._id },
        process.env.JWT_REFRESH_SECRET,
        { expiresIn: process.env.JWT_REFRESH_EXPIRES }
    );

    return { accessToken, refreshToken };
};