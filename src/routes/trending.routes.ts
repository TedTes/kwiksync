export const trendRoutes = Router();

import { Router } from "express";
import { getTrendingProducts } from "../controllers/trending.controller";

const router = Router();

router.get("/products", getTrendingProducts);

export const trendingRoutes = router;
