import cron from "node-cron";
import { checkLowStock } from "../services";
import { AppDataSource } from "../config";
import { Product } from "../models/product.model";
import { notifySupplier } from "../services/notification.service";

export class LowStockScheduler {
  private static lowStockCheckScheduler: cron.ScheduledTask;
  private static lowStockNotification: cron.ScheduledTask;
  private static productRepository = AppDataSource.getRepository(Product);
  static startLowStockCheckScheduler() {
    this.lowStockCheckScheduler = cron.schedule("0 * * * *", async () => {
      console.log("Running low-stock check...");
      await checkLowStock();
    });
    console.log("Low-stock check scheduler started (every hour).");
  }
  static stopLowStockCheckScheduler() {
    if (this.lowStockCheckScheduler) {
      this.lowStockCheckScheduler?.stop();
    }
  }

  static startLowStockNotificationScheduler() {
    this.lowStockNotification = cron.schedule("0 * * * *", async () => {
      //TODO: scheduling
      console.log("Checking low-stock products...");
      const lowStockProducts = await this.productRepository
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
  }
  static stopLowStockNotificationScheduler() {
    if (this.lowStockNotification) {
      this.lowStockNotification?.stop();
    }
  }
}
