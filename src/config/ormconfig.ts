import { DataSource } from "typeorm";
import { getDbConfig } from "./database.config";

let initialized = false;

export const AppDataSource = new DataSource(getDbConfig(false));

export const initializeDatabase = async () => {
  try {
    if (!initialized) {
      await AppDataSource.initialize();
      initialized = true;
      console.log("Database connection initialized");
    }
    return AppDataSource;
  } catch (error) {
    console.error("Error initializing database:", error);
    throw error;
  }
};
