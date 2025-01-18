import jwt from "jsonwebtoken";
import { User } from "../models";
import { JWTkeys } from "../config";
const { accessTokenKey, refreshTokenKey } = JWTkeys;
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
