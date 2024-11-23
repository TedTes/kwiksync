import { Router } from "express";
import {
  getAllProducts,
  getProductById,
  addProduct,
  updateProduct,
  deleteProduct,
  getLowStockProducts,
  restockProduct,
} from "../controllers";

export const productRoutes = Router();

productRoutes
  .get("/", getAllProducts)
  .get("/:id", getProductById)
  .post("/", addProduct)
  .put("/:id", updateProduct)
  .delete("/:id", deleteProduct)

  .get("/low-stock", getLowStockProducts)
  .patch("/:id/restock", restockProduct);
