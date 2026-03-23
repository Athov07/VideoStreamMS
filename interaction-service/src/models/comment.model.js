import mongoose from "mongoose";

const commentSchema = new mongoose.Schema({
    videoId: { type: mongoose.Schema.Types.ObjectId, required: true, index: true },
    userId: { type: mongoose.Schema.Types.ObjectId, required: true },
    username: { type: String, required: true }, // Cached for performance
    content: { type: String, required: true },
    parentId: { type: mongoose.Schema.Types.ObjectId, ref: "Comment", default: null } // For replies
}, { timestamps: true });

export const Comment = mongoose.model("Comment", commentSchema);