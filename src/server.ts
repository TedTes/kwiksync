import express from "express";
import path from "path";
import { AppDataSource } from "./config";
import {
  productRoutes,
  trendRoutes,
  authRoutes,
  webhookRoutes,
  analyticsRoutes,
} from "./routes";
import { requestLogger, errorHandler, authenticate } from "./middlewares";

import {
  startInventorySyncScheduler,
  startLowStockCheckScheduler,
  startTrendTrackingScheduler,
} from "./schedulers";

const app = express();

app
  .use(express.static(path.join(__dirname, "../dist")))
  .use(express.json())
  .get("/api/v1/health", (req, res) => {
    res.json({ status: "OK" });
  })

  .use(requestLogger)
  .use("/api/v1/auth", authRoutes)
  .use("/api/v1/auth/verify", authRoutes)
  .use("/api/v1", webhookRoutes)
  .use(authenticate)

  .use("/api/v1/products", productRoutes)
  .use("/api/v1/trends", trendRoutes)
  .use("/api/v1/analytics", analyticsRoutes)
  .get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "../dist/index.html"));
  })
  .use(errorHandler);

AppDataSource.initialize()
  .then(() => console.log("Database connected"))
  .catch((error) => console.error("Database connection error:", error));

startInventorySyncScheduler();
startLowStockCheckScheduler();
startTrendTrackingScheduler();

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on ${PORT}`));
