import { Router } from "express";
import { body } from "express-validator";
import { validateRequest } from "../middlewares";
import passport from "passport";
import {
  loginUser,
  logoutUser,
  registerNewUser,
  refreshTokensHandler,
} from "../controllers";

export const authRoutes = Router();

authRoutes.post(
  "/register",
  [
    body("email").isEmail().withMessage("A valid email is required"),
    body("password")
      .isLength({ min: 6 })
      .withMessage("Password must be at least 6 characters long"),
    body("role")
      .optional()
      .isIn(["merchant", "supplier"])
      .withMessage("Invalid role"),
    validateRequest,
  ],
  registerNewUser
);
authRoutes.post(
  "/login",
  [
    body("email").isEmail().withMessage("Valid email is required"),
    body("password").isString().notEmpty().withMessage("Password is required"),
    validateRequest,
  ],
  loginUser
);
authRoutes.post("/refresh-token", refreshTokensHandler);
authRoutes.post("/logout", logoutUser);

// Google OAuth2
authRoutes.get(
  "/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

authRoutes.get(
  "/google/callback",
  passport.authenticate("google", { failureRedirect: "/login" }),
  (req, res) => {
    res.redirect("/dashboard");
  }
);
