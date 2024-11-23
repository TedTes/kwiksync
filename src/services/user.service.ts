import { AppDataSource } from "../config/database";
import { User } from "../models/user.model";
import bcrypt from "bcrypt";

const userRepository = AppDataSource.getRepository(User);

export const createUser = async (user: Partial<User>) => {
  const salt = await bcrypt.genSalt(10);
  if (!user.password) {
    throw new Error("Password is required");
  }
  user.password = await bcrypt.hash(user.password, salt);
  return userRepository.save(user);
};

export const getAllUsers = async () => userRepository.find();
export const getUserById = async (id: number) =>
  userRepository.findOneBy({ id });
