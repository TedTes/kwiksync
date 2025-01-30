import { PaymentProvider, SubscriptionResult } from "../interfaces";
import Stripe from "stripe";

export class StripeProvider implements PaymentProvider {
  private stripe: Stripe;

  constructor(secretKey: string, publishableKey: string) {
    this.stripe = new Stripe(secretKey, {
      apiVersion: "2024-12-18.acacia",
    });
  }

  async createCustomer(
    email: string,
    paymentMethodId: string
  ): Promise<Stripe.Customer> {
    try {
      let customer;
      const customers = await this.stripe.customers.list({ email });
      if (customers.data.length > 0) {
        customer = customers.data[0];
      } else {
        customer = await this.stripe.customers.create({
          email,
          payment_method: paymentMethodId,
        });
      }

      return customer;
    } catch (error: any) {
      console.log("Error creating customer:", error);
      throw {
        message: error.message || "An error occurred while creating customer",
        status: 500,
      };
    }
  }

  async createSubscription(
    customerId: string,
    planId: string,
    paymentMethodId: string
  ): Promise<SubscriptionResult> {
    const subscription = await this.stripe.subscriptions.create({
      customer: customerId,
      items: [{ plan: planId }],
      default_payment_method: paymentMethodId,
    });

    return {
      subscriptionId: subscription.id,
      periodStart: new Date(subscription?.current_period_start * 1000),
      periodEnd: new Date(subscription?.current_period_end * 1000),
      metadata: {
        clientSecret: (subscription?.latest_invoice as any).payment_intent
          .client_secret,
      },
    };
  }

  //TODO:
  async cancelSubscription(subscriptionId: string): Promise<void> {}
  async updatePaymentMethod(
    customerId: string,
    paymentMethodObj: string
  ): Promise<void> {}
  async createPaymentMethod(
    paymentMethodId: string
  ): Promise<Stripe.PaymentMethod> {
    const paymentMethod = await this.stripe.paymentMethods.retrieve(
      paymentMethodId
    );

    return paymentMethod;
  }
  async handleWebhook(payload: any, headers: any): Promise<void> {}
}
