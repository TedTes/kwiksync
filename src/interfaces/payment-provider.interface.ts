import Stripe from "stripe";
export interface CustomerData {
  email: string;
  paymentMethodId?: string;
  [key: string]: any;
}

export interface SubscriptionResult {
  subscriptionId: string;
  periodStart: Date;
  periodEnd: Date;
  metadata?: any;
  currentPeriodEnd?: Date;
  paymentMetadata?: any;
}
export interface SubscriptionCreateParams {
  planId: number;
  price: number;
  interval: "month" | "year";
}

export interface PaymentProvider {
  createCustomer(
    email: string,
    paymentMethodId: string
  ): Promise<Stripe.Customer>;
  createSubscription(
    customerId: string,
    planId: string,
    paymentMethodId: string
  ): Promise<SubscriptionResult>;
  cancelSubscription(subscriptionId: string): Promise<void>;
  updatePaymentMethod(
    customerId: string,
    paymentMethodId: string
  ): Promise<void>;
  createPaymentMethod(paymentMethodId: string): Promise<Stripe.PaymentMethod>;
  handleWebhook(payload: any, headers: any): Promise<{ received: boolean }>;
}
