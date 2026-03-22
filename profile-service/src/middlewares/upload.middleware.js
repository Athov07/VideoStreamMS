import { upload } from "../config/storage.js";
import { ApiError } from "../utils/ApiError.js";

export const uploadAvatar = (req, res, next) => {
    const uploadSingle = upload.single("avatar");

    uploadSingle(req, res, (err) => {
        if (err) {
            console.error("Multer Error:", err);
            if (err.code === "LIMIT_FILE_SIZE") {
                return next(new ApiError(400, "Avatar image must be less than 5MB"));
            }
            return next(new ApiError(400, err.message));
        }
        next();
    });
};