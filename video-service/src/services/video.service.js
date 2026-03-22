import { Video } from "../models/video.model.js";
import { cloudinary } from "../config/cloudinary.js";
import { logActivity } from "../utils/logger.js";
import streamifier from "streamifier";

export const videoService = {
  createVideo: async (videoData, file, userId) => {
    if (!file || !file.path) {
      throw new Error("File data is missing from the request.");
    }
    const thumbnail = file.path.replace(/\.[^/.]+$/, ".jpg");

    const video = await Video.create({
      title: videoData.title,
      description: videoData.description,
      videoUrl: file.path,
      publicId: file.filename,
      thumbnailUrl: thumbnail,
      owner: userId,
      isPremium: String(videoData.isPremium) === "true",
    });

    await logActivity(
      userId,
      "VIDEO_UPLOAD",
      video._id,
      `Uploaded: ${video.title}`,
    );

    return video;
  },

  /**
   * GET ALL VIDEOS
   */
  getAllVideos: async () => {
    return await Video.find().sort({ createdAt: -1 });
  },

  /**
   * GET VIDEO BY ID
   */
  getVideoById: async (id, userId) => {
    const video = await Video.findById(id);
    if (video && userId) {
      // AUDIT LOG (Optional: tracking views)
      await logActivity(userId, "VIDEO_VIEW", id, `Viewed: ${video.title}`);
    }
    return video;
  },

  /**
   * DELETE VIDEO
   */
  deleteVideo: async (id, userId) => {
    const video = await Video.findById(id);
    if (!video) throw new Error("Video not found");
    if (video.owner.toString() !== userId.toString())
      throw new Error("Unauthorized");

    // Remove from Cloudinary
    await cloudinary.uploader.destroy(video.publicId, {
      resource_type: "video",
    });

    // Remove from DB
    const deletedVideo = await Video.findByIdAndDelete(id);

    // AUDIT LOG
    await logActivity(userId, "VIDEO_DELETE", id, `Deleted: ${video.title}`);

    return deletedVideo;
  },

  /**
   * EDIT VIDEO
   */
  editVideo: async (videoId, userId, updateData, file) => {
    const video = await Video.findById(videoId);

    if (!video) throw new Error("Video not found");
    if (video.owner.toString() !== userId.toString()) {
      throw new Error("Unauthorized to edit this video");
    }

    // Scenario: New Video File Uploaded
    if (file && file.buffer) {
      // 1. Delete old video from Cloudinary
      if (video.publicId) {
        await cloudinary.uploader.destroy(video.publicId, {
          resource_type: "video",
        });
      }

      // 2. Stream new video
      const result = await new Promise((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
          {
            resource_type: "video",
            folder: "videostream_ms",
            eager: [{ width: 300, height: 200, crop: "fill", format: "jpg" }],
            eager_async: true,
          },
          (error, res) => (error ? reject(error) : resolve(res)),
        );
        streamifier.createReadStream(file.buffer).pipe(uploadStream);
      });

      updateData.videoUrl = result.secure_url;
      updateData.publicId = result.public_id;
      updateData.thumbnailUrl = result.eager?.[0]?.secure_url || "";
    }

    const updatedVideo = await Video.findByIdAndUpdate(
      videoId,
      { $set: updateData },
      { new: true },
    );

    // AUDIT LOG
    await logActivity(
      userId,
      "VIDEO_EDIT",
      videoId,
      `Updated metadata/file for: ${updatedVideo.title}`,
    );

    return updatedVideo;
  },
  /**
   * Get video by owner
   */

  getVideosByOwner: async (userId) => {
    return await Video.find({ owner: userId }).sort({ createdAt: -1 });
  },
};
