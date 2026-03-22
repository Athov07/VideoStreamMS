import express from "express";
import {
  getMyProfile,
  updateMyProfile,
  deleteMyProfile
} from "../controllers/profile.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { uploadAvatar } from "../middlewares/upload.middleware.js";

const router = express.Router();

router.get("/me", verifyJWT, getMyProfile);
router.patch("/update", verifyJWT, uploadAvatar, updateMyProfile);
router.delete("/delete", verifyJWT, deleteMyProfile);


export default router;
