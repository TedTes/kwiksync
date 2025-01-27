import { Router } from "express";
import { getPlanController } from "../controllers";
export const planRouter = Router();

planRouter.get("/", getPlanController);
