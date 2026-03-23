import { profileService } from "../services/profile.service.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";


// 1. Get or Create Profile
export const getMyProfile = asyncHandler(async (req, res) => {
  // Pass the whole user object; service will extract id/username
  const profile = await profileService.getProfile(req.user);
  res.status(200).json({ success: true, data: profile });
});

// 2. Update Profile
export const updateMyProfile = asyncHandler(async (req, res) => {
  // Use req.user.id or req.user._id (whichever matches your token payload)
  const userId = req.user.id || req.user._id;
  
  const profile = await profileService.updateProfile(
    userId,
    req.body,
    req.file,
  );
  
  res.status(200).json({ success: true, data: profile });
});

export const deleteMyProfile = asyncHandler(async (req, res) => {
    // 1. Get the userId from the verified JWT token
    const userId = req.user.id;

    if (!userId) {
        throw new ApiError(401, "User identification failed");
    }

    // 2. Call the service to handle DB deletion and Cloudinary cleanup
    const deletedProfile = await profileService.deleteProfile(userId);

    if (!deletedProfile) {
        throw new ApiError(404, "Profile not found or already deleted");
    }

    // 3. Return success response
    res.status(200).json({
        success: true,
        message: "Profile and associated channel data deleted successfully",
        data: {}
    });
});



export const getBatchProfiles = asyncHandler(async (req, res) => {
    const { userIds } = req.query; // Expects "id1,id2,id3"

    if (!userIds) {
        return res.status(200).json({ success: true, data: [] });
    }

    const idsArray = userIds.split(",");
    const profiles = await profileService.getBatchProfiles(idsArray);

    res.status(200).json({
        success: true,
        data: profiles
    });
});
