import { Router } from "express";
import { tiktokWebhookHandler } from "../controllers/webhook.controller";

export const webhookRoutes = Router();

webhookRoutes.post("/webhook/tiktok", tiktokWebhookHandler);
