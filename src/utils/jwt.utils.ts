import jwt from "jsonwebtoken";
import { User } from "../models";
import { envVariables } from "../config";
const { accessTokenKey, refreshTokenKey } = envVariables;
export const generateTokens = (user: User) => {
  const accessToken = jwt.sign(
    { userId: user.id, email: user.email, role: user.role },
    accessTokenKey!,
    { expiresIn: "15m" }
  );

  const refreshToken = jwt.sign({ userId: user.id }, refreshTokenKey!, {
    expiresIn: "7d",
  });

  return { accessToken, refreshToken };
};

const generateAccessToken = (user: User) => {
  const secret = process.env.JWT_SECRET || "access_secret";
  return jwt.sign({ id: user.id, email: user.email, role: user.role }, secret, {
    expiresIn: "15m",
  });
};

const generateRefreshToken = (user: User) => {
  const secret = process.env.JWT_REFRESH_SECRET || "refresh_secret";
  return jwt.sign({ id: user.id }, secret, { expiresIn: "7d" });
};
