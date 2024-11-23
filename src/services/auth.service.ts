import { AppDataSource } from "../config/database";
import { User } from "../models/user.model";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

const userRepository = AppDataSource.getRepository(User);

export const registerUser = async (
  email: string,
  password: string,
  role = "user"
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

  const secret = process.env.JWT_SECRET || "test_jwt_secret";
  const token = jwt.sign(
    { id: user.id, email: user.email, role: user.role },
    secret,
    {
      expiresIn: "1h",
    }
  );

  return { token };
};

export const logout = async (token: string) => {
  // TODO: token blacklisting or session expiration logic
  return { message: "Logged out successfully" };
};
