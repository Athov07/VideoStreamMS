import { Comment } from "../models/comment.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import ApiError from "../utils/ApiError.js";
import { logger } from "../utils/logger.js";
import { AuditLog } from "../models/auditLog.model.js";

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

    // Audit Log
    await AuditLog.create({
        userId: req.user.id,
        action: parentId ? "REPLY_TO_COMMENT" : "POST_COMMENT",
        resourceId: comment._id,
        resourceType: "Comment",
        details: { videoId }
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
    const { content } = req.body;
    const comment = await Comment.findById(commentId);

    if (!comment) {
        throw new ApiError(404, "Comment not found");
    }

    if (comment.userId.toString() !== req.user.id) {
        throw new ApiError(403, "Unauthorized to edit this comment");
    }

    const oldContent = comment.content || "";

    comment.content = content;
    await comment.save();

    // Audit Log
    try {
        await AuditLog.create({
            userId: req.user.id,
            action: "UPDATE_COMMENT",
            resourceId: comment._id,
            resourceType: "Comment",
            details: { 
                oldContent: oldContent, 
                newContent: content 
            }
        });
    } catch (auditError) {
        logger.error(`Audit log failed: ${auditError.message}`);
    }

    res.status(200).json(comment);
});

export const deleteComment = asyncHandler(async (req, res) => {
    const { commentId } = req.params;
    const comment = await Comment.findById(commentId);

    if (!comment || comment.userId.toString() !== req.user.id) {
        throw new ApiError(403, "Unauthorized to delete");
    }

    await Comment.deleteMany({ $or: [{ _id: commentId }, { parentId: commentId }] });

    // Audit Log
    await AuditLog.create({
        userId: req.user.id,
        action: "DELETE_COMMENT",
        resourceId: commentId,
        resourceType: "Comment",
        details: { contentSnippet: comment.content.substring(0, 30) }
    });

    res.status(200).json({ message: "Comment and replies deleted" });
});