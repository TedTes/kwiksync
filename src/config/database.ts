import { DataSource } from "typeorm";
import {
  Merchant,
  Product,
  Supplier,
  SupplierProduct,
  TrendingProduct,
  Notification,
  LoginLinks,
} from "../models";
import { envVariables } from "./env-variables";
export const AppDataSource = new DataSource({
  ...envVariables.postgressConfig,
  type: "postgres",
  entities: [
    Merchant,
    Product,
    Supplier,
    SupplierProduct,
    TrendingProduct,
    Notification,
    LoginLinks,
  ],
});
