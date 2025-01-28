import { AppDataSource } from "../config";
import { PaymentProvider } from "../interfaces";
import { StripeProvider } from "../services";
import { PaymentCustomer, MerchantSubscription, Plan } from "../models";

export class PaymentService {
  private provider: PaymentProvider;

  constructor(providerType: string) {
    this.provider = this.getProvider(providerType);
  }

  private getProvider(type: string): PaymentProvider {
    switch (type.toLowerCase()) {
      case "stripe":
        return new StripeProvider();

      default:
        throw new Error(`Unsupported payment provider: ${type}`);
    }
  }

  async createSubscription(
    merchantId: string,
    planId: string,
    paymentData: any
  ) {
    const paymentCustomerRepo = AppDataSource.getRepository(PaymentCustomer);
    const subscriptionRepo = AppDataSource.getRepository(MerchantSubscription);
    const planRepo = AppDataSource.getRepository(Plan);

    try {
      let paymentCustomer = await paymentCustomerRepo.findOne({
        where: {
          id: merchantId,
          provider: this.provider.constructor.name,
        },
        relations: ["merchant"],
      });

      if (!paymentCustomer) {
        const providerId = await this.provider.createCustomer(
          merchantId,
          paymentData
        );

        paymentCustomer = await paymentCustomerRepo.save({
          merchantId,
          provider: this.provider.constructor.name,
          providerId,
        });
      }

      // Get plan
      const plan = await planRepo.findOneOrFail({
        where: { id: parseInt(planId) },
      });
      const priceAmount = paymentData.isAnnual
        ? plan.annualPriceInCents
        : plan.monthlyPriceInCents;
      // Create subscription with provider
      const result = await this.provider.createSubscription(
        paymentCustomer.provider,
        {
          planId: plan.id,
          price: priceAmount,
          interval: paymentData.isAnnual ? "year" : "month",
        }
      );

      // Create subscription record
      const subscription = await subscriptionRepo.save({
        merchantId,
        planId,
        provider: this.provider.constructor.name,
        providerId: result.subscriptionId,
        status: "active",
        currentPeriodStart: result.periodStart,
        currentPeriodEnd: result.periodEnd,
        paymentMetadata: {
          ...result.metadata,
          isAnnual: paymentData.isAnnual,
          price: priceAmount,
        },
      });

      return subscription;
    } catch (error) {
      console.error("Subscription creation error:", error);
      throw error;
    }
  }
}
