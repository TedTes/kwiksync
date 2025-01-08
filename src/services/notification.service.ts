import nodemailer from "nodemailer";
import { AppDataSource } from "../config";
import { Product, MerchantProduct, SupplierProduct } from "../models";
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
    const merchantProductRepo = AppDataSource.getRepository(MerchantProduct);
    const merchantProductObj = await merchantProductRepo.findOne({
      where: { product: { id: product.id } },
      relations: ["merchant"],
    });

    if (!merchantProductObj || !merchantProductObj.merchant) {
      console.warn(
        `No associated merchant found for product ID: ${product.id}. Notification skipped.`
      );
      return;
    }
    const merchantEmail = merchantProductObj.merchant.email;
    const merchantId = merchantProductObj.merchant.id;
    const message = `Low Stock Alert: Your product "${product.name}" is below the stock threshold.`;

    const emailOptions = {
      from: '"KwikSync Alerts" <alerts@kwiksync.com>',
      to: merchantEmail,
      subject: `Low Stock Alert: ${product.name}`,
      text: `Your product "${product.name}" is below the stock threshold.`,
    };
    try {
      await transporter.sendMail(emailOptions);
      console.log(
        `Low-stock email sent to ${merchantEmail} for product: ${product.name}`
      );
    } catch (emailError) {
      console.error(
        `Failed to send low-stock email to ${merchantEmail} for product: ${product.name}`,
        emailError
      );
    }
    // Save In-App Notification
    await saveNotification(merchantId, message);
    console.log(`In-app notification saved for merchant ID: ${merchantId}`);
  } catch (error) {
    console.error(
      `Error sending low-stock alert for product ${product.name}:`,
      error
    );
  }
};

export const sendTrendingNotification = async (
  merchantId: number,
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
  const supplierProductRepo = AppDataSource.getRepository(SupplierProduct);
  const supplierProductObj = await supplierProductRepo.findOne({
    where: { product: { id: product.id } },
    relations: ["supplier"],
  });

  if (!supplierProductObj || !supplierProductObj.supplier) {
    console.warn(
      `No associated supplier found for product ID: ${product.id}. Notification skipped.`
    );
    return;
  }
  const supplierEmail = supplierProductObj.supplier.email;
  const supplierId = supplierProductObj.supplier.id;
  const emailOptions = {
    from: '"KwikSync Alerts" <alerts@kwiksync.com>',
    to: supplierEmail,
    subject: `Restocking Alert: ${product.name}`,
    text: `The stock for your product "${product.name}" is running low. `,
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
