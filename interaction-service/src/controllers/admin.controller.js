import { Like } from "../models/like.model.js";
import { Comment } from "../models/comment.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import ApiError from "../utils/ApiError.js";
import mongoose from "mongoose";

export const getVideoInteractionStats = asyncHandler(async (req, res) => {
    const { videoId } = req.params;

    const stats = await Like.aggregate([
        {
            $match: { videoId: new mongoose.Types.ObjectId(videoId) }
        },
        {
            $group: {
                _id: "$videoId",
                likes: { $sum: { $cond: [{ $eq: ["$type", "like"] }, 1, 0] } },
                dislikes: { $sum: { $cond: [{ $eq: ["$type", "dislike"] }, 1, 0] } }
            }
        }
    ]);

    const commentCount = await Comment.countDocuments({ videoId: new mongoose.Types.ObjectId(videoId) });

    const result = {
        videoId,
        likes: stats[0]?.likes || 0,
        dislikes: stats[0]?.dislikes || 0,
        totalComments: commentCount,
    };

    // FIX: Manual property override because ApiError class sets data to null
    const response = new ApiError(200, "Stats retrieved successfully");
    response.data = result;
    response.success = true;

    return res.status(200).json(response);
});

export const getGlobalInteractionStats = asyncHandler(async (req, res) => {
    // This provides a bird's eye view of all video interactions for the admin table
    const globalStats = await Like.aggregate([
        {
            $group: {
                _id: "$videoId",
                likes: { $sum: { $cond: [{ $eq: ["$type", "like"] }, 1, 0] } },
                dislikes: { $sum: { $cond: [{ $eq: ["$type", "dislike"] }, 1, 0] } }
            }
        },
        {
            $lookup: {
                from: "comments", // Ensure collection name matches your DB (usually plural)
                localField: "_id",
                foreignField: "videoId",
                as: "videoComments"
            }
        },
        {
            $project: {
                _id: 0,
                videoId: { $toString: "$_id" }, // Convert to string for easier frontend matching
                likes: 1,
                dislikes: 1,
                totalComments: { $size: "$videoComments" }
            }
        }
    ]);

    // FIX: Manual property override to prevent frontend "null" crash
    const response = new ApiError(200, "Global interaction stats retrieved");
    response.data = globalStats || [];
    response.success = true;

    return res.status(200).json(response);
});