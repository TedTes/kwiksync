import express from "express";
import { getMerchantMetrics } from "../controllers";

export const merchantRoutes = express.Router();
merchantRoutes.get("/metrics", getMerchantMetrics);
