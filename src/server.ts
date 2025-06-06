require("dotenv").config({ path: `.env.${process.env.NODE_ENV}` });
import "reflect-metadata";
import express from "express";
import path from "path";
import { initializeDatabase } from "./config";
import { AppDataSource } from "./config";
import { Server } from "http";
import cors from "cors";
import cookieParser from "cookie-parser";
import {
  productRoutes,
  authRouter,
  webhookRoutes,
  analyticsRoutes,
  userRoutes,
  salesRoutes,
  metricRoutes,
  inventoryRoutes,
  trendingRoutes,
  platformRouter,
  planRouter,
  subscriptionsRouter,
} from "./routes";
import { requestLogger, errorHandler, authenticate } from "./middlewares";

import {
  InventorySyncScheduler,
  LowStockScheduler,
  TrendTrackingScheduler,
} from "./jobs";
require("./config/passport");

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
      .use(cookieParser())
      .use(express.static(path.join(__dirname, "../dist")))
      .use(express.json())
      .get("/api/v1/health", (req, res) => {
        res.json({ status: "OK" });
      })

      .use(requestLogger)
      .use("/api/v1/auth", authRouter)
      .use("/api/v1/hooks", webhookRoutes)
      .use("/api/v1/products", authenticate, productRoutes)
      .use("/api/v1/analytics", authenticate, analyticsRoutes)
      .use("/api/v1/users", authenticate, userRoutes)
      .use("/api/v1/sales", authenticate, salesRoutes)
      .use("/api/v1/metrics", authenticate, metricRoutes)
      .use("/api/v1/inventory", authenticate, inventoryRoutes)
      .use("/api/v1/trending", authenticate, trendingRoutes)
      .use("/api/v1/platform", authenticate, platformRouter)
      .use("/api/v1/pricing-plans", planRouter)
      .use("/api/v1/subscriptions", authenticate, subscriptionsRouter)
      .get("*", (req, res) => {
        res.sendFile(path.join(__dirname, "../dist/index.html"));
      })
      .use(errorHandler);

    // InventorySyncScheduler.startScheduler();
    // LowStockScheduler.startLowStockCheckScheduler();
    // TrendTrackingScheduler.startScheduler();

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
    InventorySyncScheduler.stopScheduler();
    LowStockScheduler.stopLowStockCheckScheduler();
    LowStockScheduler.stopLowStockNotificationScheduler();
    TrendTrackingScheduler.stopScheduler();

    console.log("Closing database connection...");
    await AppDataSource.destroy();

    if (ServerManager.getServer()) {
      console.log("Closing server...");
      await ServerManager.shutdown();
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
