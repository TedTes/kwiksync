import {
  PaymentProvider,
  CustomerData,
  SubscriptionResult,
  IPaymentMethod,
} from "../interfaces";
import Stripe from "stripe";

export class StripeProvider implements PaymentProvider {
  private stripe: Stripe;

  constructor(config: PaymentProviderConfig) {
    this.stripe = new Stripe(config.secretKey, {
      apiVersion: "2024-12-18.acacia",
    });
  }

  async createCustomer(
    merchantId: string,
    data: CustomerData
  ): Promise<string> {
    const customer = await this.stripe.customers.create({
      email: data.email,
      payment_method: data.paymentMethodId,
      metadata: { merchantId },
    });
    return customer.id;
  }

  async createSubscription(
    customerId: string,
    planId: string,
    paymentMethod: IPaymentMethod
  ): Promise<SubscriptionResult> {
    const subscription = await this.stripe.subscriptions.create({
      customer: customerId,
      //  items: params,
      payment_behavior: "default_incomplete",
      expand: ["latest_invoice.payment_intent"],
    });

    return {
      subscriptionId: subscription.id,
      periodStart: new Date(subscription.current_period_start * 1000),
      periodEnd: new Date(subscription.current_period_end * 1000),
      metadata: {
        clientSecret: (subscription.latest_invoice as any).payment_intent
          .client_secret,
      },
    };
  }

  //TODO:
  async cancelSubscription(subscriptionId: string): Promise<void> {}
  async updatePaymentMethod(
    customerId: string,
    paymentMethodId: string
  ): Promise<void> {}
  async createPaymentMethod(
    customerId: string,
    paymentMethodId: IPaymentMethod
  ): Promise<IPaymentMethod> {
    return {
      id: "pm_1234567890",
      merchantId: "merchant_123",
      provider: "Stripe",
      providerId: "cus_1234567890",
      paymentMethodType: "card",
      cardLast4: "4242",
      expiryDate: "12/25",
      cvc: "123",
      billingAddress: {
        street: "123 Main St",
        city: "Anytown",
        state: "CA",
        postalCode: "12345",
        country: "USA",
      },
      createdAt: new Date(),
      updatedAt: new Date(),
    };
  }
  async handleWebhook(payload: any, headers: any): Promise<void> {}
}
