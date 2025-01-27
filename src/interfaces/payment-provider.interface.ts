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
}
export interface SubscriptionCreateParams {
  planId: number;
  price: number;
  interval: "month" | "year";
}
export interface PaymentProvider {
  createCustomer(merchantId: string, data: CustomerData): Promise<string>;
  createSubscription(
    customerId: string,
    params: SubscriptionCreateParams
  ): Promise<SubscriptionResult>;
  cancelSubscription(subscriptionId: string): Promise<void>;
  updatePaymentMethod(
    customerId: string,
    paymentMethodId: string
  ): Promise<void>;
  handleWebhook(payload: any, headers: any): Promise<void>;
}
