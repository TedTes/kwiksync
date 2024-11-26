import { Router } from "express";
import { assignSupplier } from "../controllers/supplier.controller";

export const supplierRoutes = Router();

supplierRoutes.put("/link/:productId", assignSupplier);
