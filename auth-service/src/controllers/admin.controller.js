import User from "../models/user.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";

export const getAllUsers = asyncHandler(async (req, res) => {
    const users = await User.find().select("-refreshToken -password").sort({ createdAt: -1 });
    res.status(200).json({ success: true, data: users });
});

export const toggleUserRole = asyncHandler(async (req, res) => {
    const { userId, newRole } = req.body;
    
    const user = await User.findByIdAndUpdate(
        userId, 
        { role: newRole }, 
        { new: true }
    ).select("-password");

    res.status(200).json({ success: true, message: `Role updated to ${newRole}`, data: user });
});