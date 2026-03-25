import { Router } from "express";
import { createPlan, getPlans, deletePlan, updatePlan } from "../controllers/plan.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { verifyAdmin } from "../middlewares/admin.middleware.js";

const router = Router();

router.get("/", getPlans); 

router.use(verifyJWT, verifyAdmin); 
router.post("/", createPlan);
router.patch("/:id", updatePlan); 
router.delete("/:id", deletePlan);

export default router;