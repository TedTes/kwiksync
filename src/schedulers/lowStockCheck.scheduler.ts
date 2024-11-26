import cron from "node-cron";
import { checkLowStock } from "../services";
import { AppDataSource } from "../config/database";
import { Product } from "../models/product.model";
import { notifySupplier } from "../services/notification.service";

const productRepository = AppDataSource.getRepository(Product);

export const startLowStockCheckScheduler = () => {
  // Schedule checkLowStock task to run every hour
  cron.schedule("0 * * * *", async () => {
    console.log("Running low-stock check...");
    await checkLowStock();
  });

  console.log("Low-stock check scheduler started (every hour).");
};

export const startLowStockNotificationScheduler = () => {
  cron.schedule("0 * * * *", async () => {
    //TODO: scheduling
    console.log("Checking low-stock products...");
    const lowStockProducts = await productRepository
      .createQueryBuilder("product")
      .leftJoinAndSelect("product.supplier", "supplier")
      .where("quantity < restockThreshold")
      .orderBy("quantity", "ASC")
      .getMany();
    for (const product of lowStockProducts) {
      await notifySupplier(product);
    }
  });

  console.log("Low-stock notification scheduler started.");
};
