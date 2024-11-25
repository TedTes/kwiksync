import { Router } from "express";
import {
  getInventoryHistory,
  logInventoryChangeController,
  getSalesReport,
} from "../controllers";

export const analyticsRoutes = Router();

analyticsRoutes
  .get("/inventory/:productId", getInventoryHistory)
  .get("/sales", getSalesReport)
  .post("/inventory/:productId/:quantity", logInventoryChangeController);
