import { Router } from "express";
import {
  getSalesReport,
  getPlatformPerformance,
  getWeeklyRevenue,
  getRecentActivity,
} from "../controllers";

export const analyticsRoutes = Router();

analyticsRoutes
  .get("/sales", getSalesReport)
  .get("/platform-performance", getPlatformPerformance)
  .get("/weekly-revenue", getWeeklyRevenue)
  .get("/recent-activity", getRecentActivity);
//.get("/platform-trends",getPlatformTrends)
