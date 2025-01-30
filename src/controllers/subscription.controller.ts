import { Request, Response } from "express";
import Stripe from "stripe";
import { AppDataSource } from "../config";
import { PaymentService } from "../services";
import { PaymentProvider } from "../interfaces";
import { Merchant, Plan, MerchantSubscription, PaymentMethod } from "../models";
export class SubscriptionController {
  private paymentService: PaymentProvider;
  private static instances: { [key: string]: SubscriptionController } = {};
  private constructor(provider: string) {
    this.paymentService = PaymentService.getProvider(provider);
  }
  public static getInstance(provider: string): SubscriptionController {
    if (!this.instances[provider]) {
      this.instances[provider] = new SubscriptionController(provider);
    }
    return this.instances[provider];
  }
  async createSubscription(req: Request, res: Response) {
    try {
      const { email, planId, paymentMethodId, provider } = req.body;

      const merchantRepo = AppDataSource.getRepository(Merchant);
      const merchant = await merchantRepo.findOne({
        where: { email: email },
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

      const customer: Stripe.Customer =
        await this.paymentService.createCustomer(email, paymentMethodId);
      const paymentMethod: Stripe.PaymentMethod =
        await this.paymentService.createPaymentMethod(paymentMethodId);

      const subscriptionResult = await this.paymentService.createSubscription(
        customer.id,
        planId,
        paymentMethod.id
      );
      if (!subscriptionResult) {
        throw res.status(500).json({ error: "Failed to create subscription" });
      }

      const subscriptionRepo =
        AppDataSource.getRepository(MerchantSubscription);
      const subscription = new MerchantSubscription();
      const paymentMethodRepo = AppDataSource.getRepository(PaymentMethod);
      const paymentMethodIns = await paymentMethodRepo.findOne({
        where: { id: paymentMethod.id },
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

  async handleWebhook(req: Request, res: Response) {
    try {
      const sig = req.headers;
      const rawBody = req.body;
      await this.paymentService.handleWebhook(sig, rawBody);
      return { received: true };
    } catch (error: any) {
      console.error("Webhook error:", error);
      return error;
    }
  }
}
