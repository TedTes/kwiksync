import { Router } from "express";
import { SubscriptionController } from "../controllers";
import { validateRequest } from "../middlewares";
import { body } from "express-validator";
export const subscriptionsRouter = Router();

subscriptionsRouter.post(
  "/",
  [
    body("merchantId")
      .isString()
      .notEmpty()
      .withMessage("Merchant ID is required"),
    body("planId").isString().notEmpty().withMessage("Plan ID is required"),
    body("paymentMethodDetails")
      .isObject()
      .withMessage("Payment method details are required"),
    body("paymentMethodDetails.cardNumber")
      .isString()
      .notEmpty()
      .withMessage("Card number is required"),
    body("paymentMethodDetails.expiryDate")
      .isString()
      .notEmpty()
      .withMessage("Expiry date is required"),
    body("paymentMethodDetails.cvc")
      .isString()
      .notEmpty()
      .withMessage("CVC is required"),
    validateRequest,
  ],
  SubscriptionController.createSubscription
);
