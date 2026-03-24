// services/admin.service.js
import User from "../models/user.model.js";
import { AuditLog } from "../models/auditLog.model.js";
 

export const getDashboardStats = async () => {
    const [userCount, adminCount, recentLogs] = await Promise.all([
        User.countDocuments({ role: "user" }),
        User.countDocuments({ role: "admin" }),
        AuditLog.find().sort({ createdAt: -1 }).limit(5).populate("userId", "email")
    ]);

    return {
        totalUsers: userCount,
        totalAdmins: adminCount,
        recentActivity: recentLogs
    };
};

export const getAllUsers = async () => {
    return await User.find().select("-refreshToken").sort({ createdAt: -1 });
};

export const updateUserRole = async (userId, role) => {
    return await User.findByIdAndUpdate(userId, { role }, { new: true });
};

export const getSystemLogs = async () => {
    return await AuditLog.find()
        .populate("userId", "email username")
        .sort({ createdAt: -1 })
        .limit(100);
};