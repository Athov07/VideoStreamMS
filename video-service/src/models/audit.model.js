import mongoose from "mongoose";

const auditSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, required: true, ref: "User" },
  action: {
    type: String,
    enum: ["VIDEO_UPLOAD", "VIDEO_EDIT", "VIDEO_DELETE", "VIDEO_VIEW"],
    required: true,
  },
  videoId: { type: mongoose.Schema.Types.ObjectId, ref: "Video" },
  details: { type: String },
  ipAddress: { type: String },
  timestamp: { type: Date, default: Date.now },
});

export const AuditLog = mongoose.model("AuditLog", auditSchema);
