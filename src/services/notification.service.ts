import nodemailer from "nodemailer";
import { Product } from "../models/product.model";
import { saveNotification } from "./";
// Configure email transporter
const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST || "smtp.mailtrap.io",
  port: Number(process.env.EMAIL_PORT) || 587,
  auth: {
    user: process.env.EMAIL_USER || "email_user",
    pass: process.env.EMAIL_PASS || "email_pass",
  },
});

export const sendLowStockAlert = async (product: Product) => {
  try {
    const message = `Low Stock Alert: Your product "${product.name}" is below the stock threshold. Current stock: ${product.quantity}`;
    // TODO: email notification
    const emailOptions = {
      from: '"KwikSync Alerts" <alerts@kwiksync.com>',
      to: "merchant@example.com", // TODO: the merchant's email
      subject: `Low Stock Alert: ${product.name}`,
      text: `Your product "${product.name}" is below the stock threshold. Current stock: ${product.quantity}`,
    };

    await transporter.sendMail(emailOptions);

    // Save In-App Notification
    await saveNotification(product.merchantId, message);

    console.log(`Low-stock email sent for product: ${product.name}`);
  } catch (error) {
    console.error(
      `Error sending low-stock alert for product ${product.name}:`,
      error
    );
  }
};

export const sendTrendingNotification = async (
  merchantId: string,
  productName: string
) => {
  try {
    // TODO: merchant email?????
    const merchantEmail = `merchant${merchantId}@example.com`;

    const emailOptions = {
      from: '"KwikSync Alerts" <alerts@kwiksync.com>',
      to: merchantEmail,
      subject: `Your product "${productName}" is trending on TikTok!`,
      text: `Congratulations! Your product "${productName}" has reached trending status. Check your dashboard for more details.`,
    };

    await transporter.sendMail(emailOptions);
    console.log(`Trending notification sent to merchant ID: ${merchantId}`);
  } catch (error) {
    console.error("Error sending trending notification:", error);
  }
};

export const notifySupplier = async (product: Product) => {
  if (!product.supplier || !product.supplier.email) {
    console.warn(`No supplier linked for product ${product.id}`);
    return;
  }

  const emailOptions = {
    from: '"KwikSync Alerts" <alerts@kwiksync.com>',
    to: product.supplier.email,
    subject: `Restocking Alert: ${product.name}`,
    text: `The stock for your product "${product.name}" is running low. Current quantity: ${product.quantity}. Please restock.`,
  };

  try {
    await transporter.sendMail(emailOptions);
    console.log(`Notification sent to supplier for product: ${product.name}`);
  } catch (error) {
    console.error(
      `Failed to send supplier notification for product: ${product.name}`,
      error
    );
  }
};
