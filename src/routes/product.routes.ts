import { Router } from "express";
import { body } from "express-validator";
import {
  getAllProducts,
  getProductById,
  addProduct,
  updateProduct,
  deleteProduct,
  getLowStockProducts,
  restockProduct,
} from "../controllers";
import { validateRequest } from "../middlewares";

export const productRoutes = Router();

productRoutes
  .get("/", getAllProducts)
  .get("/:id", getProductById)
  .post(
    "/",
    [
      body("name").isString().notEmpty().withMessage("Name is required"),
      body("quantity")
        .isInt({ min: 0 })
        .withMessage("Quantity must be a non-negative integer"),
      body("threshold")
        .isInt({ min: 0 })
        .withMessage("Threshold must be a non-negative integer"),
      validateRequest,
    ],
    addProduct
  )
  .put("/:id", updateProduct)
  .delete("/:id", deleteProduct)

  .get("/low-stock", getLowStockProducts)
  .patch(
    "/:id/restock",
    [
      body("quantity")
        .isInt({ min: 1 })
        .withMessage("Quantity must be a positive integer"),
      validateRequest,
    ],
    restockProduct
  );
