import { Plan } from "../models/plan.model.js";

export const createPlan = async (planData) => {
    return await Plan.create(planData);
};

export const getAllActivePlans = async () => {
    return await Plan.find({ isActive: true });
};

export const updatePlan = async (planId, updateData) => {
    return await Plan.findByIdAndUpdate(
        planId, 
        { $set: updateData }, 
        { 
            new: true,           
            runValidators: true  
        }
    );
};

export const deletePlan = async (planId) => {
    return await Plan.findByIdAndUpdate(planId, { isActive: false }, { new: true });
};