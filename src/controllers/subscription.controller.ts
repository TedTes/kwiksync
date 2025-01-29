import { Request, Response } from "express";
import { AppDataSource } from "../config";
import { IPaymentMethod, PaymentProvider } from "../interfaces";
import { PaymentService } from "../services";
import { paymentConfig } from "../config";
import { Merchant, Plan, MerchantSubscription, PaymentMethod } from "../models";
export class SubscriptionController {
  static async createSubscription(req: Request, res: Response) {
    try {
      const { merchantId, planId, paymentMethodObject } = req.body;
      const providerConfig = paymentConfig[paymentMethodObject.provider];
      if (!providerConfig) {
        throw new Error(
          `Invalid configuration for provider: ${paymentMethodObject.provider}`
        );
      }
      const merchantRepo = AppDataSource.getRepository(Merchant);
      const merchant = await merchantRepo.findOne({
        where: { id: merchantId },
      });
      if (!merchant) {
        throw res.status(404).json({ error: "Merchant not found" });
      }

      const planRepo = AppDataSource.getRepository(Plan);
      const plan = await planRepo.findOne({
        where: { id: planId, isActive: true },
      });
      if (!plan) {
        throw res.status(404).json({ error: "Active plan not found" });
      }

      const paymentService = new PaymentService(
        paymentMethodObject.provider,
        providerConfig
      );
      const paymentMethodRes: IPaymentMethod =
        await paymentService.createPaymentMethod(
          merchantId,
          paymentMethodObject
        );

      const subscriptionResult = await paymentService.createSubscription(
        merchantId,
        planId,
        paymentMethodRes
      );
      if (!subscriptionResult) {
        throw res.status(500).json({ error: "Failed to create subscription" });
      }

      const subscriptionRepo =
        AppDataSource.getRepository(MerchantSubscription);
      const subscription = new MerchantSubscription();
      const paymentMethodRepo = AppDataSource.getRepository(PaymentMethod);
      const paymentMethodIns = await paymentMethodRepo.findOne({
        where: { id: paymentMethodRes.id },
      });
      if (!paymentMethodIns) {
        throw res.status(404).json({ error: "Payment method not found" });
      }
      if (
        !subscriptionResult ||
        !subscriptionResult.currentPeriodEnd ||
        !subscriptionResult.paymentMetadata
      ) {
        throw new Error("Invalid subscription result");
      }
      subscription.merchant = merchant;
      subscription.plan = plan;
      subscription.paymentMethod = paymentMethodIns;
      subscription.status = "active";
      subscription.currentPeriodStart = new Date();
      subscription.currentPeriodEnd = subscriptionResult.currentPeriodEnd;
      subscription.cancelAtPeriodEnd = false; // Default value
      subscription.paymentMetadata = subscriptionResult.paymentMetadata;

      await subscriptionRepo.save(subscription);

      // Output: Confirmation of subscription creation
      res
        .status(201)
        .json({ message: "Subscription created successfully", subscription });
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
