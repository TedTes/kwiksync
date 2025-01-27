import { Request, Response } from "express";
import { getPlanService } from "../services";
export const getPricingPlanController = async (req: Request, res: Response) => {
  try {
    console.log("req.query", req.query);
    const { billingCycle = "monthly" } = req.query;
    const plans = await getPlanService(billingCycle as string);
    res.json(plans);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch plans" });
  }
};
