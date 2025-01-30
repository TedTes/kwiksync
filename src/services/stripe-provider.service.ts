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
  async handleWebhook(
    sig: any,
    rawBody: string
  ): Promise<{ received: boolean }> {
    let event;
    const stripeSig = sig["stripe-signature"];
    try {
      // Verify the webhook signature
      event = this.stripe.webhooks.constructEvent(
        rawBody,
        stripeSig,
        process.env.STRIPE_WEBHOOK_SECRET!
      );
    } catch (err: any) {
      console.error(`Webhook signature verification failed: ${err}`);
      throw {
        message: err.message || "Webhook signature verification failed",
        status: 400,
      };
    }

    switch (event.type) {
      case "payment_intent.succeeded":
        const paymentIntent = event.data.object; // Contains a Stripe payment intent
        console.log(`PaymentIntent was successful! ID: ${paymentIntent.id}`);
        //TODO: Handle successful payment  ( update  database)
        break;
      case "payment_method.attached":
        const paymentMethod = event.data.object; // Contains a Stripe payment method
        console.log(
          `PaymentMethod was attached to a Customer! ID: ${paymentMethod.id}`
        );
        // TODO:Handle the event
        break;
      case "customer.subscription.created":
        const subscriptionCreated = event.data.object; // Contains subscription details
        console.log(`Subscription created! ID: ${subscriptionCreated.id}`);
        // TODO:Handle subscription creation
        break;
      case "customer.subscription.updated":
        const subscriptionUpdated = event.data.object; // Contains updated subscription details
        console.log(`Subscription updated! ID: ${subscriptionUpdated.id}`);
        // TODO:Handle subscription update
        break;
      case "customer.subscription.deleted":
        const subscriptionDeleted = event.data.object; // Contains deleted subscription details
        console.log(`Subscription deleted! ID: ${subscriptionDeleted.id}`);
        //TODO: Handle subscription deletion
        break;

      default:
        console.log(`Unhandled event type: ${event.type}`);
    }

    return { received: true };
  }
  catch(error: any) {
    console.error("Webhook error:", error);
    throw {
      status: 400,
      message: error,
    };
  }
}
