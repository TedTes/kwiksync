import { Router } from "express";
import {
  getInventoryHistory,
  logInventoryChangeController,
  getSalesReport,
  getPlatformPerformance,
  getWeeklyRevenue,
} from "../controllers";

export const analyticsRoutes = Router();

analyticsRoutes
  .get("/inventory/:productId", getInventoryHistory)
  .get("/sales", getSalesReport)
  .post("/inventory/:productId/:quantity", logInventoryChangeController)
  .get("/platform-performance", getPlatformPerformance)
  .get("/weekly-revenue", getWeeklyRevenue);
//.get("/platform-trends",getPlatformTrends)
