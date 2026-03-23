import mongoose from "mongoose";

const auditLogSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, required: true },
    action: { type: String, required: true }, // e.g., "DELETE_COMMENT", "LIKE_VIDEO"
    resourceId: { type: mongoose.Schema.Types.ObjectId, required: true }, // ID of comment or video
    resourceType: { type: String, enum: ["Comment", "Video"], required: true },
    details: { type: Object },
}, { timestamps: true });

export const AuditLog = mongoose.model("AuditLog", auditLogSchema);