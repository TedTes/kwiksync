import { Router } from "express";
import {
  assignSupplier,
  addSupplier,
  updateSupplier,
  removeSupplier,
  getMerchantSuppliers,
} from "../controllers/supplier.controller";

export const supplierRoutes = Router();

supplierRoutes
  .put("/link/:productId", assignSupplier)
  .post("/", addSupplier)
  .put("/:id", updateSupplier)
  .delete("/:id", removeSupplier)
  .get("/", getMerchantSuppliers);
