import jwt from "jsonwebtoken";
import { User } from "../models";
import { JWTkeys } from "../config";
import { ErrorFactory } from "./";
import crypto from "crypto";
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

export const validateHmac = (currState: string, secret: string) => {
  const [base64State, signature] = currState.split(".");
  if (!base64State || !signature) {
    throw new Error("Invalid state format");
  }

  const newSignature = crypto
    .createHmac("sha256", secret)
    .update(base64State)
    .digest("hex");

  if (newSignature !== signature) {
    throw new Error("Invalid state");
  }
  const currentTime = Date.now();

  const statePayload = JSON.parse(
    Buffer.from(base64State, "base64").toString("utf8")
  );
  if (currentTime - statePayload.timestamp > 300000) {
    // 5 minutes
    throw ErrorFactory.authentication("State expired");
  }
  return statePayload;
};
