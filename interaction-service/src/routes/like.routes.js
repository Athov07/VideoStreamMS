import { Router } from "express";
import authMiddleware from "../middlewares/auth.middleware.js";
import { toggleLike, getVideoStats } from "../controllers/like.controller.js";

const router = Router();
router.route("/:videoId").post(authMiddleware, toggleLike).get(getVideoStats);
export default router;