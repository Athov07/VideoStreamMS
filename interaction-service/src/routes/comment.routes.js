import { Router } from "express";
import authMiddleware from "../middlewares/auth.middleware.js";
import { postComment, getCommentsByVideo, updateComment, deleteComment } from "../controllers/comment.controller.js";

const router = Router();

router.route("/").post(authMiddleware, postComment);
router.route("/video/:videoId").get(getCommentsByVideo);
router.route("/:commentId").patch(authMiddleware, updateComment).delete(authMiddleware, deleteComment);

export default router;