import { Router } from "express";
import { getTrendsByProductId, addTrend } from "../controllers";
import { validateRequest } from "../middlewares";
import { body } from "express-validator";
export const trendRoutes = Router();

trendRoutes.get("/:productId", getTrendsByProductId);
trendRoutes.post(
  "/",
  [
    body("productId").isInt().withMessage("Product ID must be an integer"),
    body("likes")
      .isInt({ min: 0 })
      .withMessage("Likes must be a non-negative integer"),
    body("shares")
      .isInt({ min: 0 })
      .withMessage("Shares must be a non-negative integer"),
    body("views")
      .isInt({ min: 0 })
      .withMessage("Views must be a non-negative integer"),
    validateRequest,
  ],
  addTrend
);
