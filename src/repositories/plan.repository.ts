import { AppDataSource } from "../config";

export const planRepository = {
  getPlans: async (billingCycle: string) => {
    return await AppDataSource.query(
      `
        SELECT name, description,
          CASE WHEN $1 = 'monthly' THEN "monthlyPrice"
          ELSE "annualPrice" END as price,
          features, "isMostPopular"
        FROM plan 
        WHERE "isActive" = true
        ORDER BY price ASC
      `,
      [billingCycle]
    );
  },
};
