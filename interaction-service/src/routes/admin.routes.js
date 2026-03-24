import { Router } from "express";
import authMiddleware from "../middlewares/auth.middleware.js";
import { isAdmin } from "../middlewares/admin.middleware.js";
import { 
    getVideoInteractionStats, 
    getGlobalInteractionStats 
} from "../controllers/admin.controller.js";

const router = Router();

// Secure all interaction admin routes
router.use(authMiddleware, isAdmin);

router.get("/all-stats", getGlobalInteractionStats);
router.get("/video-stats/:videoId", getVideoInteractionStats);

export default router;