import mongoose from "mongoose";

const auditLogSchema = new mongoose.Schema({
    action: { type: String, required: true }, // e.g., "PLAN_CREATED", "PAYMENT_FAILED"
    actorId: { type: mongoose.Schema.Types.ObjectId }, // User or Admin ID
    details: { type: Object },
    ipAddress: { type: String },
}, { timestamps: true });

export const AuditLog = mongoose.model("AuditLog", auditLogSchema);