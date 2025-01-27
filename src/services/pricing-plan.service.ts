import { Plan } from "../models";
import { pricingPlanRepository } from "../repositories";
export const getPlanService = async (billingCycle: string): Promise<Plan[]> => {
  const plans = await pricingPlanRepository.getPlans(billingCycle);
  if (!plans.length) {
    throw new Error("No active plans found");
  }
  return plans;
};
