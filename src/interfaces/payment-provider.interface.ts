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
export interface IPaymentMethod {
  id: string;
  merchantId: string;
  provider: string;
  providerId: string;
  paymentMethodType: string;
  cardLast4?: string;
  expiryDate?: string;
  cvc?: string;
  billingAddress?: {
    street: string;
    city: string;
    state?: string;
    postalCode: string;
    country: string;
  };
  createdAt: Date;
  updatedAt: Date;
}
export interface PaymentProvider {
  createCustomer(merchantId: string, data: CustomerData): Promise<string>;
  createSubscription(
    customerId: string,
    planId: string,
    paymentMethod: IPaymentMethod
  ): Promise<SubscriptionResult>;
  cancelSubscription(subscriptionId: string): Promise<void>;
  updatePaymentMethod(
    customerId: string,
    paymentMethodId: string
  ): Promise<void>;
  createPaymentMethod(
    customerId: string,
    paymentMethod: IPaymentMethod
  ): Promise<IPaymentMethod>;
  handleWebhook(payload: any, headers: any): Promise<void>;
}
