import { Router, Request, Response, NextFunction } from "express";
import { SubscriptionController } from "../controllers";
import { validateRequest } from "../middlewares";
import { body } from "express-validator";
import bodyParser from "body-parser";

export const subscriptionsRouter = Router();

subscriptionsRouter.post(
  "/",
  [
    body("email").isEmail().notEmpty().withMessage("Email is required"),
    body("planId").isString().notEmpty().withMessage("Plan ID is required"),
    body("paymentMethodId").isString().withMessage("Payment id is required"),
    body("provider").isString().notEmpty().withMessage("Provider is required"),

    validateRequest,
  ],
  (req: Request, res: Response) => {
    const controller = SubscriptionController.getInstance(req.body.provider);
    return controller.createSubscription(req, res);
  }
);

subscriptionsRouter.post(
  "/stripe/webhook",
  bodyParser.json({
    verify: (req, res, buf: Buffer) => {
      (req as any).rawBody = buf.toString();
    },
  }),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const controller = SubscriptionController.getInstance("stripe");
      const result = await controller.handleWebhook(req, res);
      res.json(result);
    } catch (error: any) {
      res.status(400).json({ error: error.message || error });
    }
  }
);
