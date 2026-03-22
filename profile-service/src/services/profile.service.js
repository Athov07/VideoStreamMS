import { Profile } from "../models/profile.model.js";
import { cloudinary } from '../config/storage.js';
import { ApiError } from "../utils/ApiError.js";
import { logActivity } from "../utils/logger.js";
import mongoose from "mongoose";

export const profileService = {
    // 1. Get or Create Profile
    getProfile: async (user) => {
        const userId = user.id || user._id; 
        const username = user.username;

        if (!userId) throw new ApiError(400, "User ID missing from token");

        let profile = await Profile.findOne({ userId });

        if (!profile) {
            // Must AWAIT the creation
            profile = await Profile.create({
                userId: userId,
                username: username || "User",
                avatar: "",
                bio: ""
            });
            
            // Log creation immediately
            await logActivity(userId, 'PROFILE_CREATED', profile._id, "Channel created");
        }
        return profile;
    },

updateProfile: async (userId, updateData, file) => {
    const profile = await Profile.findOne({ userId });
    if (!profile) throw new ApiError(404, "Profile not found");

    const finalUpdate = { ...updateData };

    if (file) {
        try {
            // 1. Improved Cleanup Logic
            if (profile.avatar && profile.avatar.includes("res.cloudinary.com")) {
                // Extract everything between /avatar/ and the file extension
                // Example: .../avatar/v12345/my_image.jpg -> avatar/v12345/my_image
                const parts = profile.avatar.split('/');
                const fileNameWithExtension = parts.pop();
                const publicId = `avatar/${fileNameWithExtension.split('.')[0]}`;
                
                await cloudinary.uploader.destroy(publicId);
            }
        } catch (err) {
            console.error("Cloudinary Cleanup Error:", err.message);
            // We don't throw here so the user can still update their profile 
            // even if the old image deletion fails.
        }

        
        finalUpdate.avatar = file.path.replace('/upload/', '/upload/w_500,h_500,c_fill,g_face/');
    }

    const updatedProfile = await Profile.findOneAndUpdate(
        { userId },
        { $set: finalUpdate },
        { new: true, runValidators: true }
    );

    if (updatedProfile) {
        await logActivity(userId, 'PROFILE_UPDATED', updatedProfile._id, "User updated profile data");
    }

    return updatedProfile;
},

    // Requirement: Delete Profile
    deleteProfile: async (userId) => {
    const profile = await Profile.findOne({ userId });
    
    // Cleanup Cloudinary if an avatar exists
    if (profile?.avatar && profile.avatar.includes("res.cloudinary.com")) {
        const fileName = profile.avatar.split("/").pop().split(".")[0];
        await cloudinary.uploader.destroy(`avatar/${fileName}`);
    }

    const deleted = await Profile.findOneAndDelete({ userId });

    if (deleted) {
        // Requirement 5: Final Audit Log
        // Wrapped in try/catch so a logging error doesn't stop the deletion response
        try {
            await logActivity(userId, 'PROFILE_DELETED', deleted._id, "User deleted their profile");
        } catch (logErr) {
            console.error("Audit log failed during deletion:", logErr.message);
        }
    }

    return deleted;
}
};