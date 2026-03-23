import { Comment } from "../models/comment.model.js";

export const createComment = async (commentData) => {
    return await Comment.create(commentData);
};

export const getCommentsForVideo = async (videoId) => {
    // Fetches top-level comments and populates some info if needed
    return await Comment.find({ videoId }).sort({ createdAt: -1 });
};

export const getReplies = async (commentId) => {
    return await Comment.find({ parentId: commentId }).sort({ createdAt: 1 });
};

export const removeCommentBranch = async (commentId) => {
    // Deletes the comment and all its replies
    return await Comment.deleteMany({
        $or: [{ _id: commentId }, { parentId: commentId }]
    });
};