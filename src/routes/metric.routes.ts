import express from "express";
import { query } from "express-validator";
import { getMetrics } from "../controllers";
import { validateRequest } from "../middlewares";
export const metricRoutes = express.Router();
metricRoutes.get(
  "/",
  [
    query("id").isString().notEmpty().withMessage("user id is required"),
    validateRequest,
  ],
  getMetrics
);
