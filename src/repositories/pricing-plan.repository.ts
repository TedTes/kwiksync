import { AppDataSource } from "../config";

export const pricingPlanRepository = {
  getPlans: async (billingCycle: string) => {
    return await AppDataSource.query(
      `
        SELECT name, description,
          CASE WHEN $1 = 'monthly' THEN "monthlyPriceInCents"
          ELSE "annualPriceInCents" END as price,
          features, "isMostPopular"
        FROM plan 
        WHERE "isActive" = true
        ORDER BY price ASC
      `,
      [billingCycle]
    );
  },
};
