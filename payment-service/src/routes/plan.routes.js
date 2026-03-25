import { Router } from "express";
import { createPlan, getPlans } from "../controllers/plan.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { verifyAdmin } from "../middlewares/admin.middleware.js";

const router = Router();

router.get("/", getPlans); // Public: Users see plans to buy
router.post("/", verifyJWT, verifyAdmin, createPlan); // Admin only

export default router;