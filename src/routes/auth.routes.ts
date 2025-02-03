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
import { generateTokens, setCookie, validateHmac } from "../utils";
import { webServerURL, shopifyAuth, tiktokAuth } from "../config";
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
      const { id, email, role, name, picture } = req.user as User;
      // Generate tokens
      const { accessToken, refreshToken } = generateTokens({
        id,
        email,
        role,
      } as User);

      // Set HTTP-only cookies
      setCookie(res, "accessToken", accessToken);
      setCookie(res, "refreshToken", refreshToken);

      const data = { id, email, role, name, picture };
      res.send(`
      <script>
        window.opener.postMessage({
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
        });
        window.close();
      </script>
    `);
    }
  }
);
authRouter.get("/shopify/connect", async (req, res) => {
  const {
    shopifyClientId,
    shopifyCallbackURL,
    shopifyRedirectURL,
    shopfiyScope,
    shopifyStateSecretKey,
  } = shopifyAuth;

  const statePayload = {
    userId: req.query.userId,
    platform: "shopify",
    timestamp: Date.now(),
  };
  try {
    const base64State = Buffer.from(JSON.stringify(statePayload)).toString(
      "base64"
    );
    const signature = crypto
      .createHmac("sha256", shopifyStateSecretKey!)
      .update(JSON.stringify(statePayload))
      .digest("hex");
    const state = `${base64State}.${signature}`;

    const params = new URLSearchParams({
      client_id: shopifyClientId!,
      scope: shopfiyScope!,
      redirect_uri: shopifyCallbackURL!,
      state,
      response_type: "code",
    });

    res.send(`
       <!DOCTYPE html>
       <html>
         <head>
           <title>Redirecting to Shopify...</title>
         </head>
         <body>
           <form id="shopifyAuth" method="GET" action="${shopifyRedirectURL}?${params.toString()}">
             <input type="hidden" name="client_id" value="${shopifyClientId}" />
             <input type="hidden" name="scope" value="read_products,write_products,read_orders" />
             <input type="hidden" name="redirect_uri" value="${shopifyCallbackURL}" />
             <input type="hidden" name="state" value="${state}" />
             <input type="hidden" name="response_type" value="code" />
           </form>
           <script>
             document.getElementById('shopifyAuth').submit();
           </script>
           <noscript>
             <p>Please click the button below to continue:</p>
             <button type="submit" form="shopifyAuth">Continue to Shopify</button>
           </noscript>
         </body>
       </html>
     `);
  } catch (error: any) {
    console.error("Shopify connect error:", error);
    res.redirect("/dashboard?error=" + encodeURIComponent(error.message));
  }
});
authRouter.get(
  "/shopify/callback",
  async (req: Request, res: Response, next: NextFunction) => {
    const { code, shop, state } = req.query;

    if (!code || !shop) {
      throw ErrorFactory.authentication("Missing required query parameters.");
    }
    const { shopifyClientId, shopifyClientSecret, shopifyStateSecretKey } =
      shopifyAuth;

    if (!state) {
      throw ErrorFactory.authentication("Missing Shopify state cookie.");
    }

    const statePayload = validateHmac(state as string, shopifyStateSecretKey!);
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
      // const { userId } = statePayload;
      // Store connection in database
      // await MerchantPlatform.create({
      //   merchantId: userId,
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

authRouter.get("/tiktok/connect", (req: Request, res: Response) => {
  const { tiktokClientKey, tiktokScope, tiktokCallbackURL, tiktokAuthURL } =
    tiktokAuth;
  const state = crypto.randomBytes(16).toString("hex");
  const params = new URLSearchParams({
    client_key: tiktokClientKey!,
    response_type: "code",
    scope: tiktokScope!,
    state,
    redirect_uri: tiktokCallbackURL!,
  });

  res.redirect(`${tiktokAuthURL}?${params.toString()}`);
});

authRouter.get("/tiktok/callback", async (req: Request, res: Response) => {
  const { code, state } = req.query;
  const { tiktokClientSecret, tiktokClientKey, tiktokTokenURL } = tiktokAuth;
  const savedState = req.cookies.tiktokState;

  if (state !== savedState) {
    throw res.status(403).send("Invalid state");
  }

  try {
    const tokenResponse = await axios.post(tiktokTokenURL!, {
      client_key: tiktokClientKey,
      client_secret: tiktokClientSecret,
      code,
      grant_type: "authorization_code",
    });

    // const { access_token, refresh_token } = tokenResponse.data;

    // await MerchantPlatform.create({
    //   merchantId: req.user.id,
    //   platform: 'tiktok',
    //   accessToken: access_token,
    //   refreshToken: refresh_token,
    //   isActive: true
    // });

    res.redirect("/dashboard?connection=success");
  } catch (error) {
    res.redirect("/dashboard?connection=failed");
  }
});
