import { DataSource } from "typeorm";
import { Merchant, Product, Supplier, SupplierProduct, Trend } from "../models";

export const AppDataSource = new DataSource({
  type: "postgres",
  url: process.env.DATABASE_URL,
  synchronize: true,
  logging: true,
  entities: [Merchant, Product, Supplier, SupplierProduct, Trend, Notification],
});
