import mongoose from "mongoose";

const auditLogSchema = new mongoose.Schema({
    userId: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'User',
        required: true 
    },
    action: { 
        type: String, 
        required: true 
    }, // e.g., "USER_LOGIN", "USER_REGISTER", "USER_LOGOUT"
    resourceId: { 
        type: mongoose.Schema.Types.ObjectId, 
        required: true 
    }, 
    resourceType: { 
        type: String, 
        enum: ["Comment", "Video", "User"], 
        required: true 
    },
    details: { 
        type: Object 
    }, // Useful for storing IP addresses or browser info
}, { timestamps: true });

export const AuditLog = mongoose.model("AuditLog", auditLogSchema);