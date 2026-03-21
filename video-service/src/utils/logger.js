import { AuditLog } from '../models/audit.model.js';

export const logActivity = async (userId, action, videoId, details = "") => {
    try {
        await AuditLog.create({
            userId,
            action,
            videoId,
            details
        });
    } catch (error) {
        console.error("Audit Logging Failed:", error);
    }
};