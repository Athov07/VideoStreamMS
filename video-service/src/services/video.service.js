import { Video } from '../models/video.model.js';
import { cloudinary } from '../config/cloudinary.js';

export const videoService = {
    createVideo: async (videoData, file, userId) => {
        // Generate thumbnail URL using Cloudinary transformations
        // We take the first frame (so=0) and resize it
        const thumbnail = file.path.replace(/\.[^/.]+$/, ".jpg"); 
        
        const video = await Video.create({
            ...videoData,
            videoUrl: file.path,
            publicId: file.filename,
            thumbnailUrl: thumbnail,
            owner: userId
        });
        return video;
    },

    getAllVideos: async (userStatus) => {
        // If user is not premium, we could filter here or let controller handle it
        return await Video.find().sort({ createdAt: -1 });
    },

    getVideoById: async (id) => {
        return await Video.findById(id);
    },

    deleteVideo: async (id, userId) => {
        const video = await Video.findById(id);
        if (!video) throw new Error("Video not found");
        if (video.owner.toString() !== userId) throw new Error("Unauthorized");

        await cloudinary.uploader.destroy(video.publicId, { resource_type: 'video' });
        return await Video.findByIdAndDelete(id);
    },

    editVideo: async (videoId, userId, updateData, file) => {
        const video = await Video.findById(videoId);
        
        if (!video) throw new Error("Video not found");
        if (video.owner.toString() !== userId.toString()) throw new Error("Unauthorized to edit this video");

        // Scenario A: New Video File Uploaded
        if (file && file.buffer) {
            // 1. Delete old video from Cloudinary
            if (video.publicId) {
                await cloudinary.uploader.destroy(video.publicId, { resource_type: "video" });
            }

            // 2. Stream new video to Cloudinary
            const result = await new Promise((resolve, reject) => {
                const uploadStream = cloudinary.uploader.upload_stream(
                    {
                        resource_type: "video",
                        folder: "videostream_ms",
                        eager: [{ width: 300, height: 200, crop: "fill", format: "jpg" }],
                        eager_async: true
                    },
                    (error, result) => (error ? reject(error) : resolve(result))
                );
                streamifier.createReadStream(file.buffer).pipe(uploadStream);
            });

            // Update URLs in the data object
            updateData.videoUrl = result.secure_url;
            updateData.publicId = result.public_id;
            updateData.thumbnailUrl = result.eager?.[0]?.secure_url || "";
        }

        // Scenario B: Update title/description and/or new URLs
        const updatedVideo = await Video.findByIdAndUpdate(
            videoId,
            { $set: updateData },
            { new: true } // Returns the updated document
        );

        return updatedVideo;
    }


};