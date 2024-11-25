import { Router } from "express";
import {
  getInventoryHistory,
  logInventoryChangeController,
} from "../controllers";

export const analyticsRoutes = Router();

analyticsRoutes
  .get("/inventory/:productId", getInventoryHistory)
  .post("/inventory/:productId/:quantity", logInventoryChangeController);
