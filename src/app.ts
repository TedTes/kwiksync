import express from "express";
import { AppDataSource } from "./config";
import { productRoutes, trendRoutes, authRoutes } from "./routes";
import { requestLogger, errorHandler, authenticate } from "./middlewares";
const app = express();

app.use(express.json());
app.use(requestLogger);
app.use("/auth", authRoutes);
app.use(authenticate);

app.use("/products", productRoutes);
app.use("/trends", trendRoutes);
app.use(errorHandler);

AppDataSource.initialize()
  .then(() => console.log("Database connected"))
  .catch((error) => console.error("Database connection error:", error));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on ${PORT}`));
