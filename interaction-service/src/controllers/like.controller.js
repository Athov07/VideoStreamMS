import { Like } from "../models/like.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { logger } from "../utils/logger.js";
import { AuditLog } from "../models/auditLog.model.js";
import { emitInteractionEvent } from "../services/kafka.service.js";

export const toggleLike = asyncHandler(async (req, res) => {
    const { videoId } = req.params;
    const { type } = req.body; // "like" or "dislike"
    const userId = req.user.id;

    const existingInteraction = await Like.findOne({ videoId, userId });

    if (existingInteraction) {
        if (existingInteraction.type === type) {
            await Like.findByIdAndDelete(existingInteraction._id);
            await emitInteractionEvent({ videoId, type, action: "removed" });
            return res.status(200).json({ message: "Interaction removed" });
        }
        const oldType = existingInteraction.type;
        existingInteraction.type = type;
        await existingInteraction.save();
        await emitInteractionEvent({ videoId, type, oldType, action: "changed" });
        await AuditLog.create({
            userId,
            action: `CHANGE_TO_${type.toUpperCase()}`,
            resourceId: videoId,
            resourceType: "Video"
        });
        
        return res.status(200).json({ message: `Changed to ${type}` });
    }

    await Like.create({ videoId, userId, type });
    await emitInteractionEvent({ videoId, type, action: "added" });
    await AuditLog.create({
        userId,
        action: `${type.toUpperCase()}_VIDEO`,
        resourceId: videoId,
        resourceType: "Video"
    });
    
    res.status(201).json({ message: `Video ${type}d successfully` });
});

export const getVideoStats = asyncHandler(async (req, res) => {
    const { videoId } = req.params;
    const likes = await Like.countDocuments({ videoId, type: "like" });
    const dislikes = await Like.countDocuments({ videoId, type: "dislike" });
    res.status(200).json({ likes, dislikes });
});