import { AppDataSource } from "../config";
import { IPaymentMethod, PaymentProvider } from "../interfaces";
import { StripeProvider } from "../services";
import { MerchantSubscription, Plan } from "../models";

export class PaymentService {
  private providerCache: { [key: string]: PaymentProvider } = {};
  private provider: PaymentProvider;
  constructor(provider: string, config: PaymentProviderConfig) {
    this.provider = this.getProvider(provider, config);
  }
  public async createSubscription(
    merchantId: string,
    planId: string,
    paymentMethod: any
  ) {
    // Logic to create a subscription using the provider's API
    return await this.provider.createSubscription(
      merchantId,
      planId,
      paymentMethod
    );
  }
  public async createPaymentMethod(
    merchantId: string,
    paymentMethodObject: IPaymentMethod
  ): Promise<IPaymentMethod> {
    try {
      // TODO:Logic to create a payment method using the provider's API
      return await this.provider.createPaymentMethod(
        merchantId,
        paymentMethodObject
      );
    } catch (error: any) {
      console.error("Payment method creation error:", error);
      throw {
        message:
          error.message || "An error occurred while creating payment method",
        status: 500,
      };
    }
  }
  private getProvider(
    provider: string,
    config: {
      secretKey: string;
      publishableKey: string;
    }
  ): PaymentProvider {
    try {
      if (!this.providerCache[provider]) {
        switch (provider.toLowerCase()) {
          case "stripe":
            this.providerCache[provider] = new StripeProvider(config);
            break;
          default:
            throw new Error(`Unsupported payment provider: ${provider}`);
        }
      }
      return this.providerCache[provider];
    } catch (error: any) {
      console.error("Payment provider error:", error);
      throw (
        error.message || "An error occurred while initializing payment provider"
      );
    }
  }
}
