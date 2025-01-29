import { Request, Response } from "express";
import { PaymentProvider } from "../interfaces";
import { PaymentService } from "../services";
import { paymentConfig } from "../config";
export class SubscriptionController {
  static async create(req: Request, res: Response) {
    try {
      const { merchantId, provider, paymentData } = req.body;
      const providerConfig = paymentConfig[provider];
      if (!providerConfig) {
        throw new Error(`Invalid configuration for provider: ${provider}`);
      }
      const paymentService: PaymentProvider = PaymentService.getProvider(
        provider,
        providerConfig
      );
      const subscription = await paymentService.createSubscription(
        merchantId,
        paymentData
      );

      res.json(subscription);
    } catch (error: any) {
      console.error("Subscription creating error");
      res.status(400).json({ error: error.message || error });
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
