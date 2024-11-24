import express from "express";
import { AppDataSource } from "./config";
import {
  productRoutes,
  trendRoutes,
  authRoutes,
  webhookRoutes,
} from "./routes";
import { requestLogger, errorHandler, authenticate } from "./middlewares";

import { startInventorySyncScheduler } from "./schedulers/inventorySync.scheduler";

const app = express();

app.use(express.json());
app.use(requestLogger);
app.use("/auth", authRoutes);
app.use("/api", webhookRoutes);
app.use(authenticate);

app.use("/products", productRoutes);
app.use("/trends", trendRoutes);
app.use(errorHandler);

AppDataSource.initialize()
  .then(() => console.log("Database connected"))
  .catch((error) => console.error("Database connection error:", error));

startInventorySyncScheduler();
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on ${PORT}`));
