import multer from "multer";

// Use memoryStorage to enable high-speed streaming
const storage = multer.memoryStorage();

// Filter to ensure only videos are processed
const fileFilter = (req, file, cb) => {
    if (file.mimetype.startsWith("video/")) {
        cb(null, true);
    } else {
        cb(new Error("Only video files are allowed!"), false);
    }
};

export const upload = multer({ 
    storage,
    fileFilter,
    limits: {
        fileSize: 100 * 1024 * 1024, // 100MB limit
    }
});