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
  ProductInventory,
  ProductPlatform,
} from "../models";

const {
  postgressConfig: { url },
} = envVariables;

export const getDbConfig = (isMigration = false): DataSourceOptions => ({
  type: "postgres",
  url,
  logging: ["error", "schema"],
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
    ProductInventory,
    ProductPlatform,
  ],
  migrations: ["dist/migrations/migrations/*.js"],
  migrationsRun: false,
  synchronize: false,
});
