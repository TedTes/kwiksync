import { Request, Response, NextFunction } from "express";
import {
  login,
  logout,
  registerUser,
  refreshTokens,
  sendMagicLink,
  verifyMagicLink,
} from "../services/auth.service";
import { rateLimit, setCookie } from "../utils";

export const registerNewUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { email, password, role } = req.body;
    const user = await registerUser(email, password, role);
    res.status(201).json({ message: "User registered successfully", user });
  } catch (err) {
    next(err);
  }
};
export const loginUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { email, password } = req.body;
    const data = await login(email, password);
    res.status(200).json(data);
  } catch (err) {
    next(err);
  }
};

export const logoutUser = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const email = (req as any).email;
    const data = await logout(email);
    res.status(200).json(data);
  } catch (err) {
    next(err);
  }
};

export const refreshTokensHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { refreshToken } = req.body;
    if (!refreshToken) {
      next({ status: 400, message: "Refresh token is required" });
    }
    const tokens = await refreshTokens(refreshToken);
    res.status(200).json(tokens);
  } catch (err) {
    next(err);
  }
};

export const sendMagicLinkController = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { email } = req.body;

    if (!email || typeof email !== "string") {
      res.status(400).json({
        success: false,
        message: "Email is required",
      });
      return;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      res.status(400).json({
        success: false,
        message: "Invalid email format",
      });
      return;
    }

    // Check rate limit
    const rateLimitKey = `magic_link_${email}`;
    const isRateLimited = await rateLimit.check(rateLimitKey);
    if (isRateLimited) {
      res.status(429).json({
        success: false,
        message: "Too many requests. Please try again later.",
      });
      return;
    }
    await sendMagicLink(email);

    await rateLimit.increment(rateLimitKey);

    res.status(200).json({
      success: true,
      message: "Magic link sent successfully",
    });
  } catch (error: any) {
    console.error("Magic link error:", error);
    next(error);
  }
};

export const verifyMagicLinkController = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { token, email } = req.query;

    const result = await verifyMagicLink(token as string, email as string);

    if (result.isSuccess && result.accessToken && result.refreshToken) {
      const { accessToken, refreshToken } = result;
      setCookie(res, "accessToken", accessToken);
      setCookie(res, "refreshToken", refreshToken);
      res.status(200).json({
        success: true,
        message: "Authentication successful",
        user: result.user,
      });
      return;
    }

    res.status(400).json({
      success: result.isSuccess,
      message: "Invalid or expired magic link",
    });
    return;
  } catch (error) {
    console.error("Magic link verification error:", error);
    next(error);
  }
};
