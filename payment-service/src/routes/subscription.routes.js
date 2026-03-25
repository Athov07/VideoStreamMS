import { Router } from "express";
import { checkStatus } from "../controllers/subscription.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router();
router.get("/status", verifyJWT, checkStatus);

export default router;