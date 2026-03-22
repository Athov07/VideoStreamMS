import { Router } from "express";
import {
  uploadVideo,
  getVideos,
  getVideoById,
  deleteVideo,
  updateVideo,
  getMyVideos
} from "../controllers/video.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { upload } from "../config/cloudinary.js";

const router = Router();

// All routes are protected via JWT
router.use(verifyJWT);

router.post('/upload', verifyJWT, upload.single('video'), uploadVideo);
router.get("/all", getVideos);
router.get("/my-videos", verifyJWT, getMyVideos);
router.patch("/update/:videoId", verifyJWT, upload.single("video"), updateVideo);
router.get("/:id", getVideoById);
router.delete("/:id", deleteVideo);

export default router;
