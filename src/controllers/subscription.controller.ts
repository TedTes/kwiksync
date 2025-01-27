import { Request, Response } from "express";
import { PaymentService } from "../services";

export class SubscriptionController {
  async create(req: Request, res: Response) {
    try {
      const { merchantId, planId, provider, paymentData } = req.body;

      const paymentService = new PaymentService(provider);
      const subscription = await paymentService.createSubscription(
        merchantId,
        planId,
        paymentData
      );

      res.json(subscription);
    } catch (error: any) {
      console.error("Subscription creation error:", error);
      res.status(400).json({ error: error.message });
    }
  }

  async webhook(req: Request, res: Response) {
    try {
      const { provider } = req.params;
      const paymentService = new PaymentService(provider);

      //await paymentService.handleWebhook(req.body, req.headers);

      res.json({ received: true });
    } catch (error: any) {
      console.error("Webhook error:", error);
      res.status(400).send(`Webhook Error: ${error.message}`);
    }
  }
}
