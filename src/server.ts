import "reflect-metadata";
import express from "express";
import path from "path";
import { initializeDatabase } from "./config";
import { AppDataSource } from "./config";
import { Server } from "http";
import cors from "cors";
import {
  productRoutes,
  authRoutes,
  webhookRoutes,
  analyticsRoutes,
  userRoutes,
  salesRoutes,
  metricRoutes,
  inventoryRoutes,
  trendingRoutes,
  platformRouter,
} from "./routes";
import { requestLogger, errorHandler, authenticate } from "./middlewares";

import {
  startInventorySyncScheduler,
  startLowStockCheckScheduler,
  startTrendTrackingScheduler,
} from "./schedulers";
import cron from "node-cron";
require("./config/passport");

let inventorySyncJob: cron.ScheduledTask;
let lowStockCheckJob: cron.ScheduledTask;
let trendTrackingJob: cron.ScheduledTask;

class ServerManager {
  private static serverInstance: Server;
  static startServer(serverInstance: Server) {
    this.serverInstance = serverInstance;
  }
  static getServer() {
    return this.serverInstance;
  }

  static async shutdown() {
    if (this.serverInstance) {
      await new Promise((resolve) => {
        this.serverInstance.close(resolve);
      });
    }
  }
}

const startServer = async () => {
  try {
    await initializeDatabase();
    console.log("Database initialized successfully");
    const app = express();
    app
      .use(cors())
      .use(express.static(path.join(__dirname, "../dist")))
      .use(express.json())
      .get("/api/v1/health", (req, res) => {
        res.json({ status: "OK" });
      })

      .use(requestLogger)
      .use("/api/v1/auth", authRoutes)
      .use("/api/v1/hooks", webhookRoutes)
      .use("/api/v1/products", authenticate, productRoutes)
      .use("/api/v1/analytics", analyticsRoutes)
      .use("/api/v1/users", authenticate, userRoutes)
      .use("/api/v1/sales", authenticate, salesRoutes)
      .use("/api/v1/metrics", metricRoutes)
      .use("/api/v1/inventory", inventoryRoutes)
      .use("/api/v1/trending", trendingRoutes)
      .use("/api/v1/platform", platformRouter)
      .get("*", (req, res) => {
        res.sendFile(path.join(__dirname, "../dist/index.html"));
      })
      .use(errorHandler);

    inventorySyncJob = startInventorySyncScheduler();
    lowStockCheckJob = startLowStockCheckScheduler();
    trendTrackingJob = startTrendTrackingScheduler();
    const PORT = process.env.PORT || 3000;
    const serverInstance = app.listen(PORT, () =>
      console.log(`Server running on ${PORT}`)
    );
    ServerManager.startServer(serverInstance);
  } catch (error) {
    console.error("Failed to start server:", error);
    process.exit(1);
  }
};

startServer().catch((error) => {
  console.error("Unhandled error during server startup:", error);
  process.exit(1);
});

process.on("unhandledRejection", (reason, promise) => {
  console.error("Unhandled Rejection at:", promise, "reason:", reason);
  process.exit(1);
});

process.on("uncaughtException", (error) => {
  console.error("Uncaught Exception:", error);
  process.exit(1);
});

const shutdown = async () => {
  console.log("Shutting down server gracefully...");
  let exitCode = 0;
  try {
    console.log("Stopping schedulers...");
    inventorySyncJob?.stop();
    lowStockCheckJob?.stop();
    trendTrackingJob?.stop();

    console.log("Closing database connection...");
    await AppDataSource.destroy();

    if (ServerManager.getServer()) {
      console.log("Closing server...");
      ServerManager.shutdown();
    }
  } catch (error) {
    console.error("Error during shutdown:", error);
    exitCode = 1;
  } finally {
    console.log("Shutdown complete");
    process.exit(exitCode);
  }
};

process.on("SIGTERM", shutdown);
process.on("SIGINT", shutdown);
