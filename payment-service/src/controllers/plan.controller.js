import * as planService from "../services/plan.service.js";
import { asyncHandler } from "../utils/asyncHandler.js";

export const createPlan = asyncHandler(async (req, res) => {
    const plan = await planService.createPlan(req.body);
    res.status(201).json({ success: true, data: plan });
});

export const getPlans = asyncHandler(async (req, res) => {
    const plans = await planService.getAllActivePlans();
    res.status(200).json({ success: true, data: plans });
});