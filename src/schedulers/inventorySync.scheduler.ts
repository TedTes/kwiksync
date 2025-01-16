import cron from "node-cron";
import { syncTikTokInventory } from "../services/inventorySync.service";

export class InventorySyncScheduler {
  private static inventorySyncJob: cron.ScheduledTask;

  static startScheduler() {
    try {
      this.inventorySyncJob = cron.schedule("0 * * * *", async () => {
        console.log("Running TikTok inventory sync fallback...");
        await syncTikTokInventory();
      });
      console.log("TikTok inventory sync scheduler started (every hour).");
    } catch (error: any) {
      console.log(`error starting Inventory sync scheduler:${error}`);
      throw error;
    }
  }
  static stopScheduler() {
    if (this.inventorySyncJob) {
      this.inventorySyncJob?.stop();
    }
  }
}
