import { AppDataSource, paymentConfig } from "../config";
import { PaymentProvider } from "../interfaces";
import { StripeProvider } from "../services";
import { MerchantSubscription, Plan } from "../models";

export class PaymentService {
  private static providerCache: { [key: string]: PaymentProvider } = {};
  public static getProvider(provider: string): PaymentProvider {
    try {
      if (!this.providerCache[provider]) {
        const providerKey = provider as PaymentProviderKey;
        switch (provider.toLowerCase()) {
          case "stripe":
            const stripeConfig = paymentConfig[providerKey] as StripeConfig;
            if (!stripeConfig) {
              throw new Error(
                `Configuration for provider "${provider}" is missing.`
              );
            }
            this.providerCache[provider] = new StripeProvider(
              stripeConfig.secretKey,
              stripeConfig.publishableKey
            );
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
