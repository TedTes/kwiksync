import cron from "node-cron";
import { trackTrends } from "../services";

export const startTrendTrackingScheduler = () => {
  // Schedule trackTrends  task to run every hour
  cron.schedule("0 * * * *", async () => {
    console.log("Running trend tracking...");
    await trackTrends();
  });

  console.log("Trend tracking scheduler started (every hour).");
};
