import cron from "node-cron";
import { checkLowStock } from "../services";

export const startLowStockCheckScheduler = () => {
  // Schedule checkLowStock task to run every hour
  cron.schedule("0 * * * *", async () => {
    console.log("Running low-stock check...");
    await checkLowStock();
  });

  console.log("Low-stock check scheduler started (every hour).");
};
