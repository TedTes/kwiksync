import { DataSource } from "typeorm";
import {
  Merchant,
  Product,
  Supplier,
  SupplierProduct,
  TrendingProduct,
  Notification,
  LoginLinks,
  User,
} from "../models";
import { envVariables } from "./env-variables";
const {
  postgressConfig: { url, synchronize, logging },
} = envVariables;

const parseBooleanEnvVar = (
  value: string | undefined,
  defaultValue: boolean
): boolean => {
  if (value === undefined) return defaultValue;
  return value.toLowerCase() === "true";
};

const parsePort = (value: string | undefined, defaultValue: number): number => {
  if (!value) return defaultValue;
  const port = parseInt(value, 10);
  return isNaN(port) ? defaultValue : port;
};

export const AppDataSource = new DataSource({
  url,
  logging: parseBooleanEnvVar(logging, true),
  // entities: ["src/models/*.ts"],
  type: "postgres",
  entities: [
    Merchant,
    Product,
    Supplier,
    SupplierProduct,
    TrendingProduct,
    Notification,
    LoginLinks,
    User,
  ],
  migrations: ["src/migrations/*.ts"],
  migrationsRun: true, // Automatically run pending migrations,
  synchronize: false,
});
