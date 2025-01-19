import { AppDataSource } from "../config";
import { User, LoginLinks } from "../models";
import jwt, { JsonWebTokenError, TokenExpiredError } from "jsonwebtoken";
import bcrypt from "bcrypt";
import { createHash, randomBytes } from "crypto";
import { webServerURL, magicLinkSecretKey, JWTkeys } from "../config";
import {
  EmailTemplates,
  generateTokens,
  ErrorFactory,
  sendEmail,
} from "../utils";
const { refreshTokenKey } = JWTkeys;
const userRepository = AppDataSource.getRepository(User);
const loginLinksRepository = AppDataSource.getRepository(LoginLinks);

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

  return { accessToken, hashedRefreshToken };
};

export const refreshTokens = async (currRefreshToken: string) => {
  try {
    const decoded: any = jwt.verify(currRefreshToken, refreshTokenKey!);
    const user = await userRepository.findOneBy({ id: decoded.userId });

    if (!user || !user.refreshToken) throw new Error("User not found");

    const isValidRefreshToken = user.refreshToken === currRefreshToken;
    if (!isValidRefreshToken) throw new Error("Invalid refresh token");

    const { accessToken, refreshToken } = generateTokens(user);
    user.refreshToken = refreshToken;

    await userRepository.save(user);

    return { accessToken, refreshToken };
  } catch (err) {
    if (err instanceof JsonWebTokenError) {
      throw new Error("Invalid refresh token format");
    }
    if (err instanceof TokenExpiredError) {
      throw new Error("Refresh token expired");
    }
    throw new Error(`Error refreshing token: ${err}`);
  }
};

export const logout = async (email: string) => {
  const user = await userRepository.findOneBy({ email });
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
      const newUser = await userRepository.create({
        email,
        role: "USER",
        createdAt: new Date(),
      });
      await userRepository.save(newUser);
    }
    const newLoginSession = await loginLinksRepository.create({
      email,
      token: hashedToken,
      expiresAt: new Date(timestamp + 30 * 60 * 1000), //30 minutes
      used: false,
    });
    await loginLinksRepository.save(newLoginSession);

    await loginLinksRepository
      .createQueryBuilder()
      .delete()
      .from("login_links")
      .where("email = :email", { email })
      .andWhere("expiresAt < :currentDate", { currentDate: new Date() })
      .execute();

    const magicLink = `${webServerURL}/verify?token=${token}&email=${encodeURIComponent(
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

export const verifyMagicLink = async (
  token: string,
  email: string
): Promise<IVerifiedUser> => {
  try {
    const hashedToken = createHash("sha256")
      .update(`${token}${magicLinkSecretKey}`)
      .digest("hex");

    const magicLink = await loginLinksRepository.findOne({
      where: {
        email,
        token: hashedToken,
        used: false,
      },
    });

    if (!magicLink) {
      throw ErrorFactory.validation(
        "INVALID_TOKEN",
        "Invalid or expired magic link"
      );
    } else if (magicLink.expiresAt < new Date()) {
      await loginLinksRepository
        .createQueryBuilder()
        .delete()
        .from("login_links")
        .where("email = :email", { email })
        .andWhere("expiresAt < :currentDate", { currentDate: new Date() });
      throw ErrorFactory.validation("INVALID_TOKEN");
    }

    const user = await userRepository.findOneBy({ email });

    if (!user) {
      throw ErrorFactory.notFound("User not found");
    }

    await loginLinksRepository.update({ id: magicLink.id }, { used: true });
    const { accessToken, refreshToken } = generateTokens(user);
    await userRepository.update(user.id, {
      lastLoginAt: new Date(),
      refreshToken: refreshToken,
    });

    return {
      isSuccess: true,
      accessToken,
      refreshToken,
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
      },
    };
  } catch (error) {
    console.error("Verify magic link error:", error);
    return {
      isSuccess: false,
    };
  }
};
