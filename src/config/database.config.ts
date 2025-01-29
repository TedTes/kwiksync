import { DataSourceOptions } from "typeorm";
import { postgressConfig } from "./env-variables";

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
  Plan,
  PaymentMethod,
  MerchantSubscription,
} from "../models";

export const getDbConfig = (isMigration = false): DataSourceOptions => ({
  type: "postgres",
  url: postgressConfig.url,
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
    Plan,
    PaymentMethod,
    MerchantSubscription,
  ],
  migrations: ["dist/migrations/migrations/*.js"],
  migrationsRun: false,
  synchronize: false,
});
