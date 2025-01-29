import { AppDataSource } from "../config";
import { PaymentProvider } from "../interfaces";
import { StripeProvider } from "../services";
import { MerchantSubscription, Plan } from "../models";

export class PaymentService {
  private static provider: { [key: string]: PaymentProvider } = {};
  public static getProvider(
    provider: string,
    config: {
      secretKey: string;
      publishableKey: string;
    }
  ): PaymentProvider {
    try {
      if (!this.provider[provider]) {
        switch (provider.toLowerCase()) {
          case "stripe":
            this.provider[provider] = new StripeProvider(config);
            break;
          default:
            throw new Error(`Unsupported payment provider: ${provider}`);
        }
      }
      return this.provider[provider];
    } catch (error: any) {
      console.error("Payment provider error:", error);
      throw (
        error.message || "An error occurred while initializing payment provider"
      );
    }
  }
}
