import mongoose from "mongoose";

const likeSchema = new mongoose.Schema({
    videoId: { type: mongoose.Schema.Types.ObjectId, required: true, index: true },
    userId: { type: mongoose.Schema.Types.ObjectId, required: true },
    type: { type: String, enum: ["like", "dislike"], required: true }
}, { timestamps: true });

// Ensure a user can only have one interaction (like or dislike) per video
likeSchema.index({ videoId: 1, userId: 1 }, { unique: true });

export const Like = mongoose.model("Like", likeSchema);