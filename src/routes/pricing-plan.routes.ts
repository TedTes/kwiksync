import { Router } from "express";
import { getPricingPlanController } from "../controllers";
export const planRouter = Router();

planRouter.get("/", getPricingPlanController);
