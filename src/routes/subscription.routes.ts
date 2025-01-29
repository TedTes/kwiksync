import { Router } from "express";
import { SubscriptionController } from "../controllers";

export const subscriptionsRouter = Router();

subscriptionsRouter.get("/", SubscriptionController.create);
