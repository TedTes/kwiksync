import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { JWTkeys } from "../config";
import { refreshTokens } from "../services";
import { setCookie } from "../utils";
const { accessTokenKey } = JWTkeys;
export const authenticate = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const authCookies = req.cookies;

  if (!authCookies || !authCookies.accessToken) {
    next({
      status: 401,
      message: "Unauthorized: No access token provided",
    });
  }

  try {
    const token = authCookies.accessToken;

    const decoded = jwt.verify(token, accessTokenKey!);
    (req as any).user = decoded;
    next();
  } catch (error) {
    // if access token has expired
    const refreshTokenCurr = authCookies.refreshToken;
    if (!refreshTokenCurr) {
      next({ status: 401, error: "Refresh token missing" });
    }
    try {
      const { accessToken } = await refreshTokens(refreshTokenCurr);
      const decoded = jwt.verify(accessToken, accessTokenKey!);
      req.user = decoded;
      setCookie(res, "accessToken", accessToken);
      return next();
    } catch (refreshError) {
      next({
        status: 401,
        message: "Failed to refresh token",
        error: refreshError,
      });
    }
  }
};
