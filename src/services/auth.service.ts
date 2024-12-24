import { AppDataSource } from "../config/database";
import { User, LoginLinks } from "../models";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { createHash, randomBytes } from "crypto";
import { envVariables } from "../config";
import {
  EmailTemplates,
  generateTokens,
  ErrorFactory,
  sendEmail,
} from "../utils";
const userRepository = AppDataSource.getRepository(User);
const loginLinksRepository = AppDataSource.getRepository(LoginLinks);

const { magicLinkSecretKey, appServerURL } = envVariables;
export const registerUser = async (
  email: string,
  password: string,
  role = "merchant"
) => {
  const existingUser = await userRepository.findOneBy({ email });
  if (existingUser) {
    throw new Error("User already exists");
  }

  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  const newUser = userRepository.create({
    email,
    password: hashedPassword,
    role,
  });
  return userRepository.save(newUser);
};
export const login = async (email: string, password: string) => {
  const user = await userRepository.findOneBy({ email });
  if (!user) {
    throw new Error("Invalid email or password");
  }

  const isPasswordValid = await bcrypt.compare(password, user.password);
  if (!isPasswordValid) {
    throw new Error("Invalid email or password");
  }

  const { accessToken, refreshToken } = generateTokens(user);

  const hashedRefreshToken = await bcrypt.hash(refreshToken, 10);
  user.refreshToken = hashedRefreshToken;
  await userRepository.save(user);

  return { accessToken, refreshToken };
};

export const refreshTokens = async (currRefreshToken: string) => {
  const secret = process.env.JWT_REFRESH_SECRET || "refresh_secret";

  try {
    const decoded: any = jwt.verify(currRefreshToken, secret);

    const user = await userRepository.findOneBy({ id: decoded.id });
    if (!user) throw new Error("User not found");

    const isValidRefreshToken = await bcrypt.compare(
      currRefreshToken,
      user.refreshToken || ""
    );
    if (!isValidRefreshToken) throw new Error("Invalid refresh token");
    const { accessToken, refreshToken } = generateTokens(user);

    const hashedRefreshToken = await bcrypt.hash(refreshToken, 10);
    user.refreshToken = hashedRefreshToken;
    await userRepository.save(user);

    return { accessToken, refreshToken };
  } catch (err) {
    throw new Error("Invalid or expired refresh token");
  }
};

export const logout = async (userId: string) => {
  const user = await userRepository.findOneBy({ id: userId });
  if (!user) throw new Error("User not found");

  user.refreshToken = null;
  await userRepository.save(user);

  return { message: "Logged out successfully" };
};

export const sendMagicLink = async (email: string): Promise<void> => {
  try {
    const token = randomBytes(32).toString("hex");
    const timestamp = Date.now();
    const hashedToken = createHash("sha256")
      .update(`${token}${magicLinkSecretKey}`)
      .digest("hex");
    const existingUser = await userRepository.findOneBy({ email });
    if (!existingUser) {
      const newUser = userRepository.create({
        email,
        role: "USER",
        createdAt: new Date(),
      });
    }
    loginLinksRepository.create({
      email,
      token: hashedToken,
      expiresAt: new Date(timestamp + 30 * 60 * 1000), //30 minutes
      used: false,
    });

    await loginLinksRepository
      .createQueryBuilder()
      .delete()
      .from("LoginLinks")
      .where("email = :email", { email })
      .andWhere("expiresAt < :currentDate", { currentDate: new Date() })
      .execute();

    const magicLink = `${appServerURL}/api/v1/auth/verify?token=${token}&email=${encodeURIComponent(
      email
    )}`;
    const emailContent = EmailTemplates.magicLink(email, magicLink);
    await sendEmail(emailContent);
  } catch (error: any) {
    console.error("Send magic link error:", error);
    if (error.code === "EMAIL_ERROR") {
      throw ErrorFactory.server("Failed to send magic link");
    }
    throw error;
  }
};

export const verifyMagicLink = async (token: string, email: string) => {
  const hashedToken = createHash("sha256")
    .update(`${token}${magicLinkSecretKey}`)
    .digest("hex");

  const magicLink = await loginLinksRepository.findOne({
    where: {
      email,
      token: hashedToken,
    },
  });

  if (!magicLink) {
    throw ErrorFactory.validation(
      "INVALID_TOKEN",
      "Invalid or expired magic link"
    );
  }

  const user = await userRepository.findOneBy({ email });

  if (!user) {
    throw ErrorFactory.notFound("User not found");
  }

  await loginLinksRepository.update({ id: magicLink.id }, { used: true });
  const { accessToken, refreshToken } = generateTokens(user);
  userRepository.update(user.id, {
    lastLoginAt: new Date(),
    refreshToken: refreshToken,
  });
  return {
    success: true,
    accessToken,
    refreshToken,
    user: {
      id: user.id,
      email: user.email,
      role: user.role,
    },
  };
};
