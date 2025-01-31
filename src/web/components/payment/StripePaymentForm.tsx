import React, { FormEventHandler, useState } from "react";
import { CardElement, useStripe, useElements } from "@stripe/react-stripe-js";

export const StripePaymentForm: React.FC<{ plan: string }> = (plan) => {
  const stripe = useStripe();
  const elements = useElements();
  const [amount] = useState(1000);
  const [paymentResult, setPaymentResult] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  console.log(plan);
  const handleSubmit = async (event: React.ChangeEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsLoading(true);
    setPaymentResult("");

    // Create a payment intent on the server
    const response = await fetch("/create-payment-intent", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ amount, currency: "usd" }),
    });

    const { clientSecret } = await response.json();
    if (!stripe || !elements) {
      setPaymentResult("Stripe.js has not loaded yet. Please try again later.");
      setIsLoading(false);
      return;
    }
    const cardElement = elements.getElement(CardElement);
    if (!cardElement) {
      setPaymentResult("Card element not found. Please try again.");
      setIsLoading(false);
      return;
    }

    // Confirm the payment with the card details
    const { error, paymentIntent } = await stripe.confirmCardPayment(
      clientSecret,
      {
        payment_method: {
          card: cardElement,
          billing_details: {
            name: "Customer Name",
          },
        },
      }
    );

    if (error && error.message) {
      setPaymentResult(error.message);
    } else {
      setPaymentResult(
        `Payment succeeded! PaymentIntent ID: ${
          paymentIntent && paymentIntent.id
        }`
      );
    }

    setIsLoading(false);
  };

  return (
    <form onSubmit={handleSubmit}>
      <CardElement />
      <button type="submit" disabled={isLoading}>
        {isLoading ? "Processing..." : "Pay with Stripe"}
      </button>
      {paymentResult && <div>{paymentResult}</div>}
    </form>
  );
};
