import { Comment } from "../models/comment.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import ApiError from "../utils/ApiError.js";

export const postComment = asyncHandler(async (req, res) => {
    const { videoId, content, parentId } = req.body;

    // Validate content
    if (!content) throw new ApiError(400, "Content is required");
    
    const comment = await Comment.create({
        videoId,
        content,
        parentId: parentId || null,
        userId: req.user.id,
        username: req.user.username // Passed from JWT
    });
    res.status(201).json(comment);
});

export const getCommentsByVideo = asyncHandler(async (req, res) => {
    const { videoId } = req.params;
    const comments = await Comment.find({ videoId }).sort("-createdAt");
    res.status(200).json(comments);
});

export const updateComment = asyncHandler(async (req, res) => {
    const { commentId } = req.params;
    const comment = await Comment.findById(commentId);

    if (!comment || comment.userId.toString() !== req.user.id) {
        throw new ApiError(403, "Unauthorized to edit this comment");
    }

    comment.content = req.body.content;
    await comment.save();
    res.status(200).json(comment);
});

export const deleteComment = asyncHandler(async (req, res) => {
    const { commentId } = req.params;
    const comment = await Comment.findById(commentId);

    if (!comment || comment.userId.toString() !== req.user.id) {
        throw new ApiError(403, "Unauthorized to delete");
    }

    await Comment.deleteMany({ $or: [{ _id: commentId }, { parentId: commentId }] });
    res.status(200).json({ message: "Comment and replies deleted" });
});