import { videoService } from '../services/video.service.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { ApiError } from '../utils/ApiError.js';

export const uploadVideo = asyncHandler(async (req, res) => {
    if (!req.file) throw new ApiError(400, "Video file is required");
    
    const video = await videoService.createVideo(req.body, req.file, req.user._id);
    res.status(201).json({ success: true, data: video });
});

export const getVideos = asyncHandler(async (req, res) => {
    const videos = await videoService.getAllVideos();
    
    // Check access: If user is NOT premium, hide videoUrl for premium content
    const processedVideos = videos.map(video => {
        if (video.isPremium && !req.user.isPremium) {
            return { ...video._doc, videoUrl: null, message: "Premium Content - Upgrade to watch" };
        }
        return video;
    });

    res.status(200).json({ success: true, data: processedVideos });
});

export const getVideoById = asyncHandler(async (req, res) => {
    const video = await videoService.getVideoById(req.params.id);
    if (!video) throw new ApiError(404, "Video not found");

    if (video.isPremium && !req.user.isPremium) {
        throw new ApiError(403, "This is premium content. Please upgrade your plan.");
    }

    res.status(200).json({ success: true, data: video });
});

export const deleteVideo = asyncHandler(async (req, res) => {
    await videoService.deleteVideo(req.params.id, req.user._id);
    res.status(200).json({ success: true, message: "Video deleted successfully" });
});

export const updateVideo = asyncHandler(async (req, res) => {
    const { videoId } = req.params;
    const { title, description } = req.body;

    if (!title && !description && !req.file) {
        throw new ApiError(400, "Provide at least one field to update");
    }

    const updatedVideo = await videoService.editVideo(
        videoId, 
        req.user._id, 
        { title, description }, 
        req.file
    );

    res.status(200).json({
        success: true,
        message: "Video updated successfully",
        data: updatedVideo
    });
});