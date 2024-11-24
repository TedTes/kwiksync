import { Request, Response, NextFunction } from "express";
import {
  login,
  logout,
  registerUser,
  refreshTokens,
} from "../services/auth.service";

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
    const userId = (req as any).user.id;
    const data = await logout(userId);
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
    const tokens = await refreshTokens(refreshToken);
    res.status(200).json(tokens);
  } catch (err) {
    next(err);
  }
};
