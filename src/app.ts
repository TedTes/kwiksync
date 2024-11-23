import express from "express";
import { AppDataSource } from "./config";
import { productRoutes, trendRoutes } from "./routes";

const app = express();

app.use(express.json());

AppDataSource.initialize()
  .then(() => console.log("Database connected"))
  .catch((error) => console.error("Database connection error:", error));

app.use("/products", productRoutes);
app.use("/trends", trendRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on ${PORT}`));
