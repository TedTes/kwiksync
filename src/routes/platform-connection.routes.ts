import { Router } from "express";
import { getPlatformConnections } from "../controllers";

export const platformRouter = Router();

platformRouter.get("/stat", getPlatformConnections);
