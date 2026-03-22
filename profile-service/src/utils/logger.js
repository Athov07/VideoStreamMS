import { AuditLog } from '../models/auditLog.model.js';
import mongoose from 'mongoose';

export const logActivity = async (userId, action, targetId = null, details = "") => {
    try {
        // Add a check to prevent casting errors
        if (!mongoose.Types.ObjectId.isValid(userId)) {
            console.error("Invalid UserId for logging:", userId);
            return; 
        }

        const logData = {
            userId: new mongoose.Types.ObjectId(userId),
            action,
            details,
            timestamp: new Date()
        };
        // ... rest of code
    } catch (error) {
        console.error("Audit Log Error:", error.message);
    }
};

// export const logActivity = async (userId, action, targetId = null, details = "") => {
//     try {
//         // Ensure we are using valid ObjectIds to prevent Mongoose Casting Errors
//         const logData = {
//             userId: new mongoose.Types.ObjectId(userId),
//             action,
//             details,
//             timestamp: new Date()
//         };

//         if (targetId) {
//             logData.targetId = new mongoose.Types.ObjectId(targetId);
//         }

//         const log = await AuditLog.create(logData);
//         console.log(" Audit Log Saved:", log._id);
//     } catch (error) {
//         // If this fails, we only log to console so the API doesn't crash
//         console.error(" Audit Log Error:", error.message);
//     }
// };


