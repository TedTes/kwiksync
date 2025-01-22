import { Router, Request, Response, NextFunction } from "express";
import { body, query } from "express-validator";
import { ErrorFactory } from "../utils";
import crypto from "crypto";
import { validateRequest } from "../middlewares";
import passport from "passport";
import { User } from "../models";
import axios from "axios";
import {
  loginUser,
  logoutUser,
  registerNewUser,
  refreshTokensHandler,
  sendMagicLinkController,
  verifyMagicLinkController,
} from "../controllers";
import { generateTokens, setCookie } from "../utils";
import { webServerURL, shopifyAuth } from "../config";
export const authRouter = Router();

const allowedOrigin = `${webServerURL}/dashboard`;

authRouter.post(
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
authRouter.post(
  "/login",
  [
    body("email").isEmail().withMessage("Valid email is required"),
    body("password").isString().notEmpty().withMessage("Password is required"),
    validateRequest,
  ],
  loginUser
);
authRouter.post(
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
authRouter.get(
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
authRouter.post("/refresh-token", refreshTokensHandler);
authRouter.post("/logout", logoutUser);

// Google OAuth2
authRouter.get(
  "/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

authRouter.get(
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
      setCookie(res, "accessToken", accessToken);
      setCookie(res, "refreshToken", refreshToken);

      const data = { id, email, role };
      res.send(`
      <script>
        window.opener.postMessage({
          success: true,
          result: ${JSON.stringify(data)},
        }, "${allowedOrigin}");
        window.close();
      </script>
    `);
    } catch (error) {
      console.error("error", error);
      res.send(`
      <script>
        window.opener.postMessage({
          success: false,
        });
        window.close();
      </script>
    `);
    }
  }
);
authRouter.get("/shopify/connect", (req, res) => {
  const {
    shopifyClientId,
    shopifyCallbackURL,
    shopifyRedirectURL,
    shopfiyScope,
  } = shopifyAuth;

  const state = crypto.randomBytes(16).toString("hex");
  setCookie(res, "shopifyState", state);

  const params = new URLSearchParams({
    client_id: shopifyClientId!,
    scope: `${shopfiyScope}`,
    redirect_uri: `${shopifyCallbackURL}`,
    state,
  });
  res.redirect(`${shopifyRedirectURL}?${params.toString()}`);
});
authRouter.get(
  "/shopify/callback",
  async (req: Request, res: Response, next: NextFunction) => {
    const { code, shop, state } = req.query;

    if (!code || !shop) {
      throw ErrorFactory.authentication("Missing required query parameters.");
    }
    const { shopifyClientId, shopifyClientSecret } = shopifyAuth;
    const shopifyState = req.cookies.shopifyState;
    if (!shopifyState) {
      throw ErrorFactory.authentication("Missing Shopify state cookie.");
    }
    if (state !== shopifyState) {
      throw ErrorFactory.authentication("Invalid state");
    }

    try {
      const tokenResponse = await axios.post(
        `https://${shop}/admin/oauth/access_token`,
        {
          client_id: shopifyClientId,
          client_secret: shopifyClientSecret,
          code,
        }
      );

      const { access_token } = tokenResponse.data;

      // Store connection in database
      // await MerchantPlatform.create({
      //   merchantId: req.user.id,
      //   platform: "shopify",
      //   accessToken: access_token,
      //   shopUrl: shop,
      //   isActive: true,
      // });

      res.redirect("/dashboard?connection=success");
    } catch (error) {
      console.log(`shopify callback error`, error);
      res.redirect("/dashboard?connection=failed");
    }
  }
);
