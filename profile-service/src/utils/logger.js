import { AuditLog } from '../models/auditLog.model.js';
import mongoose from 'mongoose';


export const logActivity = async (userId, action, targetId = null, details = "") => {
    try {
        if (!userId || !mongoose.Types.ObjectId.isValid(userId)) {
            console.error("Audit Log Error: Invalid or missing userId", userId);
            return;
        }
        const logData = {
            userId: new mongoose.Types.ObjectId(userId),
            action,
            details,
            timestamp: new Date()
        };

        if (targetId) {
            logData.targetId = new mongoose.Types.ObjectId(targetId);
        }

        const log = await AuditLog.create(logData);
    } catch (error) {
        console.error(" Audit Log Error:", error.message);
    }
};


