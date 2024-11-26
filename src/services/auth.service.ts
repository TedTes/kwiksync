import { AppDataSource } from "../config/database";
import { User } from "../models/user.model";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

const userRepository = AppDataSource.getRepository(User);

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

  const accessToken = generateAccessToken(user);
  const refreshToken = generateRefreshToken(user);

  const hashedRefreshToken = await bcrypt.hash(refreshToken, 10);
  user.refreshToken = hashedRefreshToken;
  await userRepository.save(user);

  return { accessToken, refreshToken };
};

export const refreshTokens = async (refreshToken: string) => {
  const secret = process.env.JWT_REFRESH_SECRET || "refresh_secret";

  try {
    const decoded: any = jwt.verify(refreshToken, secret);

    const user = await userRepository.findOneBy({ id: decoded.id });
    if (!user) throw new Error("User not found");

    const isValidRefreshToken = await bcrypt.compare(
      refreshToken,
      user.refreshToken || ""
    );
    if (!isValidRefreshToken) throw new Error("Invalid refresh token");

    const accessToken = generateAccessToken(user);
    const newRefreshToken = generateRefreshToken(user);

    const hashedRefreshToken = await bcrypt.hash(newRefreshToken, 10);
    user.refreshToken = hashedRefreshToken;
    await userRepository.save(user);

    return { accessToken, refreshToken: newRefreshToken };
  } catch (err) {
    throw new Error("Invalid or expired refresh token");
  }
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

export const logout = async (userId: string) => {
  const user = await userRepository.findOneBy({ id: userId });
  if (!user) throw new Error("User not found");

  user.refreshToken = null;
  await userRepository.save(user);

  return { message: "Logged out successfully" };
};
