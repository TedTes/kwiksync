import { Router } from "express";
import { getTrendsByProductId, addTrend } from "../controllers";

export const trendRoutes = Router();

trendRoutes.get("/:productId", getTrendsByProductId);
trendRoutes.post("/", addTrend);
