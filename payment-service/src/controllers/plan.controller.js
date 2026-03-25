import * as planService from "../services/plan.service.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { Plan } from "../models/plan.model.js";
import { ApiError } from "../utils/ApiError.js";


export const createPlan = asyncHandler(async (req, res) => {
    const plan = await planService.createPlan(req.body);
    res.status(201).json({ success: true, data: plan });
});



export const getPlans = asyncHandler(async (req, res) => {
    const plans = await planService.getAllActivePlans();
    res.status(200).json({ success: true, data: plans });
});



export const updatePlan = asyncHandler(async (req, res) => {
    const { id } = req.params;
    
    const updatedPlan = await planService.updatePlan(id, req.body);
    
    if (!updatedPlan) {
        throw new ApiError(404, "Plan not found or update failed.");
    }

    res.status(200).json({ 
        success: true, 
        data: updatedPlan 
    });
});



export const deletePlan = asyncHandler(async (req, res) => {
    const { id } = req.params;
    
    const deactivatedPlan = await planService.deletePlan(id);
    
    if (!deactivatedPlan) {
        throw new ApiError(404, "Plan not found. Could not deactivate.");
    }

    res.status(200).json({ 
        success: true, 
        message: "Plan successfully deactivated.",
        data: deactivatedPlan 
    });
});