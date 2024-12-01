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
  .use(express.static(path.join(__dirname, "../dist/public")))
  .use(express.json())
  .get("/api/health", (req, res) => {
    res.json({ status: "OK" });
  })
  .get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "../dist/public/index.html"));
  })
  .use(requestLogger)
  .use("/auth", authRoutes)
  .use("/api", webhookRoutes)
  .use(authenticate)

  .use("/products", productRoutes)
  .use("/trends", trendRoutes)
  .use("/analytics", analyticsRoutes)
  .use(errorHandler);

AppDataSource.initialize()
  .then(() => console.log("Database connected"))
  .catch((error) => console.error("Database connection error:", error));

startInventorySyncScheduler();
startLowStockCheckScheduler();
startTrendTrackingScheduler();

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on ${PORT}`));
