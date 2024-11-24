import cron from "node-cron";
import { syncTikTokInventory } from "../services/inventorySync.service";

export const startInventorySyncScheduler = () => {
  // Schedule polling task to run every hour
  cron.schedule("0 * * * *", async () => {
    console.log("Running TikTok inventory sync fallback...");
    await syncTikTokInventory();
  });

  console.log("TikTok inventory sync scheduler started (every hour).");
};
