import cron from "node-cron";
import { trackTrends } from "../services";

export class TrendTrackingScheduler {
  private static trendTrackingScheduler: cron.ScheduledTask;
  static startScheduler() {
    this.trendTrackingScheduler = cron.schedule("0 * * * *", async () => {
      console.log("Running trend tracking...");
      await trackTrends();
    });

    console.log("Trend tracking scheduler started (every hour).");
  }
  static stopScheduler() {
    if (this.trendTrackingScheduler) {
      this.trendTrackingScheduler?.stop();
    }
  }
}
