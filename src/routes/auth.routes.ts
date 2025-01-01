import { Router, Request, Response, NextFunction } from "express";
import { body, query } from "express-validator";
import { validateRequest } from "../middlewares";
import passport from "passport";
import { User } from "../models";
import {
  loginUser,
  logoutUser,
  registerNewUser,
  refreshTokensHandler,
  sendMagicLinkController,
  verifyMagicLinkController,
} from "../controllers";
import { generateTokens } from "../utils";
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
authRoutes.post(
  "/magic-link",
  [
    body("email")
      .isEmail()
      .normalizeEmail()
      .withMessage("Valid email is required"),

    validateRequest,
  ],
  sendMagicLinkController
);
authRoutes.get(
  "/verify",
  [
    query("token")
      .isString()
      .notEmpty()
      .withMessage("Token is required")
      .isLength({ min: 64, max: 64 })
      .withMessage("Invalid token format"),
    query("email")
      .isEmail()
      .normalizeEmail()
      .withMessage("Valid email is required"),
    validateRequest,
  ],
  verifyMagicLinkController
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
  passport.authenticate("google", { session: false }),
  (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id, email, role } = req.user as User;
      // Generate tokens
      const { accessToken, refreshToken } = generateTokens({
        id,
        email,
        role,
      } as User);

      // Set HTTP-only cookies
      res.cookie("accessToken", accessToken, {
        httpOnly: true,
        secure: true,
        sameSite: "strict",
      });

      res.cookie("refreshToken", refreshToken, {
        httpOnly: true,
        secure: true,
        sameSite: "strict",
      });

      // Send success to frontend popup
      res.send(`
        <script>
          window.opener.postMessage({ 
            success: true, 
            email: "${email}",

          }, "${process.env.FRONTEND_URL}");
        </script>
      `);
    } catch (error) {
      res.send(`
        <script>
          window.opener.postMessage({ 
            success: false, 
            error: "Login failed"
          }, "${process.env.FRONTEND_URL}");
        </script>
      `);
    }
  }
);
