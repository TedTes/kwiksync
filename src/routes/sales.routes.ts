import { Router } from "express";

import { getWeeklyRevenue } from "../controllers";

export const salesRoutes = Router();

salesRoutes.get("/weekly-revenue", getWeeklyRevenue);
