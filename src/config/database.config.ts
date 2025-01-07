import { DataSourceOptions } from "typeorm";
import { envVariables } from "./env-variables";

import {
  Merchant,
  Product,
  Supplier,
  SupplierProduct,
  TrendingProduct,
  Notification,
  LoginLinks,
  User,
  Sales,
  Platform,
  MerchantProduct,
} from "../models";

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

export const getDbConfig = (isMigration = false): DataSourceOptions => ({
  type: "postgres",
  url,
  logging: parseBooleanEnvVar(logging, true),
  entities: [
    Merchant,
    Product,
    Supplier,
    SupplierProduct,
    TrendingProduct,
    Notification,
    LoginLinks,
    User,
    Sales,
    Platform,
    MerchantProduct,
  ],
  migrations: ["dist/migrations/migrations/*.js"],
  migrationsRun: false,
  synchronize: false,
});
