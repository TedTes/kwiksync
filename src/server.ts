import "reflect-metadata";
import express from "express";
import path from "path";
import { initializeDatabase } from "./config";
import cors from "cors";
import {
  productRoutes,
  trendRoutes,
  authRoutes,
  webhookRoutes,
  analyticsRoutes,
  userRoutes,
  salesRoutes,
  metricRoutes,
  inventoryRoutes,
  trendingRoutes,
} from "./routes";
import { requestLogger, errorHandler, authenticate } from "./middlewares";

import {
  startInventorySyncScheduler,
  startLowStockCheckScheduler,
  startTrendTrackingScheduler,
} from "./schedulers";
require("./config/passport");
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
      .use("/api/v1/trends", authenticate, trendRoutes)
      .use("/api/v1/analytics", analyticsRoutes)
      .use("/api/v1/users", authenticate, userRoutes)
      .use("/api/v1/sales", authenticate, salesRoutes)
      .use("/api/v1/metrics", metricRoutes)
      .use("/api/v1/inventory", inventoryRoutes)
      .use("/api/v1/trending", trendingRoutes)
      .get("*", (req, res) => {
        res.sendFile(path.join(__dirname, "../dist/index.html"));
      })
      .use(errorHandler);

    startInventorySyncScheduler();
    startLowStockCheckScheduler();
    startTrendTrackingScheduler();
    const PORT = process.env.PORT || 3000;
    app.listen(PORT, () => console.log(`Server running on ${PORT}`));
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
  console.log("Shutting down server...");
  // TODO:
  // Close database connections
  // Stop schedulers
  // Close server
  process.exit(0);
};

process.on("SIGTERM", shutdown);
process.on("SIGINT", shutdown);
