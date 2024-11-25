import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { User } from "../models";
export const authenticate = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    next({ status: 401, message: "Unauthorized: No token provided" });
    return;
  }
  const token = authHeader?.split(" ")[1];

  try {
    const secret = process.env.JWT_SECRET || "temp_jwt_secret";
    const decoded = jwt.verify(token, secret) as User;
    (req as any).user = {
      id: decoded.id,
      role: decoded.role,
      email: decoded.email,
    };
    next();
  } catch (error) {
    next(error);
  }
};
