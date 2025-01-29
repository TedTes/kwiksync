import { Request, Response } from "express";
import { PaymentProvider } from "../interfaces";
import { PaymentService } from "../services";

export class SubscriptionController {
  static async create(req: Request, res: Response) {
    try {
      const { merchantId, provider, paymentData } = req.body;

      const paymentService: PaymentProvider =
        PaymentService.getProvider(provider);
      const subscription = await paymentService.createSubscription(
        merchantId,
        paymentData
      );

      res.json(subscription);
    } catch (error: any) {
      console.error("Subscription creation error:", error);
      res.status(400).json({ error: error.message });
    }
  }

  static async webhook(req: Request, res: Response) {
    try {
      // const { provider } = req.params;
      // const paymentService = new PaymentService(provider);

      //await paymentService.handleWebhook(req.body, req.headers);

      res.json({ received: true });
    } catch (error: any) {
      console.error("Webhook error:", error);
      res.status(400).send(`Webhook Error: ${error.message}`);
    }
  }
}
