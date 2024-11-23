import { Request, Response, NextFunction } from "express";
import { login, logout } from "../services/auth.service";

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
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) {
      res.status(400).json({ error: "Token is required for logout" });
      return;
    }
    const data = await logout(token);
    res.status(200).json(data);
  } catch (err) {
    next(err);
  }
};
