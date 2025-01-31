import React from "react";

export const PayPalPaymentForm: React.FC<{ plan: string }> = (plan) => {
  console.log(plan);
  const handlePayPalPayment = () => {
    // TODO: Implement PayPal payment logic

    console.log("PayPal payment initiated");
  };

  return (
    <div>
      <h2>Pay with PayPal</h2>
      <button onClick={handlePayPalPayment}>Pay with PayPal</button>
    </div>
  );
};
