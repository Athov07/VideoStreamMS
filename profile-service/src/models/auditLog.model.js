import mongoose from 'mongoose';

const auditLogSchema = new mongoose.Schema({
    userId: { 
        type: mongoose.Schema.Types.ObjectId, 
        required: true,
        index: true 
    },
    action: { 
        type: String, 
        required: true,
        enum: ['PROFILE_CREATED', 'PROFILE_UPDATED', 'PROFILE_DELETED', 'SUBSCRIBED', 'UNSUBSCRIBED']
    },
    targetId: { 
        type: mongoose.Schema.Types.ObjectId, 
        required: false 
    },
    details: { 
        type: String, 
        default: "" 
    },
    ipAddress: { 
        type: String 
    },
    timestamp: { 
        type: Date, 
        default: Date.now 
    }
}, { timestamps: false });

export const AuditLog = mongoose.model('AuditLog', auditLogSchema);