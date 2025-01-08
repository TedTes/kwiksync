import { NextFunction, Request, Response } from "express";
import {
  fetchProductById,
  restockProductById,
  createProduct,
} from "../services/product.service";
import CryptoJS from "crypto-js";

export const tiktokWebhookHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    // TODO:
    const signature = req.headers["x-tiktok-signature"]; ///?????
    if (!verifyWebhookSignature(signature, req.body)) {
      next({ status: 403, message: "Invalid signature" });
    }

    const { productId, stock } = req.body; // actual TikTok payload structure ????

    const product = await fetchProductById(productId);

    if (product && product.id) {
      await restockProductById(product.id, stock);
      console.log(`Updated product stock for ID: ${productId}`);
    } else {
      console.warn(
        `Product with ID: ${productId} not found. Creating new product.`
      );
      await createProduct({
        id: productId,
        //quantity: stock,
      });
    }

    res.status(200).json({ message: "Webhook processed successfully" });
  } catch (error) {
    console.error("Error processing TikTok webhook:", error);
    next({ status: 500, message: "Internal Server Error" });
  }
};

// Helper function to verify webhook signature
const verifyWebhookSignature = (
  signature: string | undefined | string[],
  payload: any
): boolean => {
  if (!signature || typeof signature !== "string") {
    console.error("Invalid or missing signature");
    return false;
  }

  const secret = process.env.TIKTOK_WEBHOOK_SECRET || "webhook_secret";

  const computedSignature = CryptoJS.HmacSHA256(
    JSON.stringify(payload),
    secret
  ).toString(CryptoJS.enc.Hex);
  return timingSafeEqual(signature, computedSignature);
};

const timingSafeEqual = (a: string, b: string): boolean => {
  if (a.length !== b.length) return false;
  let result = 0;
  for (let i = 0; i < a.length; i++) {
    result |= a.charCodeAt(i) ^ b.charCodeAt(i);
  }
  return result === 0;
};
