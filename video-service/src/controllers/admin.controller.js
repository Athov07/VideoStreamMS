import { Video } from "../models/video.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";

export const getAllVideosForAdmin = asyncHandler(async (req, res) => {
    const videos = await Video.find().sort({ createdAt: -1 });
    
    res.status(200).json({
        success: true,
        data: videos
    });
});

export const deleteVideoAdmin = asyncHandler(async (req, res) => {
    const { videoId } = req.params;
    
    const video = await Video.findById(videoId);
    if (!video) return res.status(404).json({ message: "Video not found" });
    
    await Video.findByIdAndDelete(videoId);

    res.status(200).json({
        success: true,
        message: "Video deleted successfully by admin"
    });
});

export const togglePremiumStatus = asyncHandler(async (req, res) => {
    const { videoId } = req.params;
    const video = await Video.findById(videoId);
    
    if (!video) return res.status(404).json({ message: "Video not found" });

    video.isPremium = !video.isPremium;
    await video.save();

    res.status(200).json({
        success: true,
        message: `Video marked as ${video.isPremium ? 'Premium' : 'Free'}`,
        data: video
    });
});