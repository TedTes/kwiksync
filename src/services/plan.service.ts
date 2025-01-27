import { Plan } from "../models";
import { planRepository } from "../repositories";
export const getPlanService = async (billingCycle: string): Promise<Plan[]> => {
  const plans = await planRepository.getPlans(billingCycle);
  if (!plans.length) {
    throw new Error("No active plans found");
  }
  return plans;
};
