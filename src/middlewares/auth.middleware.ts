import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

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
    const decoded = jwt.verify(token, secret);
    (req as any).user = decoded;
    next();
  } catch (error) {
    next(error);
  }
};
