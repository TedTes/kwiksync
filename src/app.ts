import express from "express";
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
  .use(express.json())
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
