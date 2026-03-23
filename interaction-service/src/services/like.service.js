import { Like } from "../models/like.model.js";

export const toggleLikeInDB = async (videoId, userId, type) => {
    const existing = await Like.findOne({ videoId, userId });

    if (existing) {
        if (existing.type === type) {
            await Like.findByIdAndDelete(existing._id);
            return { action: "removed" };
        }
        existing.type = type;
        await existing.save();
        return { action: "updated", type };
    }

    const newLike = await Like.create({ videoId, userId, type });
    return { action: "created", data: newLike };
};

export const fetchVideoStats = async (videoId) => {
    const likes = await Like.countDocuments({ videoId, type: "like" });
    const dislikes = await Like.countDocuments({ videoId, type: "dislike" });
    return { likes, dislikes };
};