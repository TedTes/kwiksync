import { Router } from "express";
import { body } from "express-validator";
import { validateRequest } from "../middlewares";
import { loginUser, logoutUser } from "../controllers";

export const authRoutes = Router();

authRoutes.post(
  "/login",
  [
    body("email").isEmail().withMessage("Valid email is required"),
    body("password").isString().notEmpty().withMessage("Password is required"),
    validateRequest,
  ],
  loginUser
);

authRoutes.post("/logout", logoutUser);
