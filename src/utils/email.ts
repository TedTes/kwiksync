import nodemailer from "nodemailer";
import { CustomError, ErrorFactory } from "./errors";
import { emailConfig } from "../config";
const transporter = nodemailer.createTransport(emailConfig);
interface EmailContent {
  to: string;
  subject: string;
  html: string;
  text?: string;
  attachments?: EmailAttachment[];
}
interface EmailAttachment {
  filename: string;
  content: Buffer | string;
  contentType?: string;
}
// Email templates
export const EmailTemplates = {
  /**
   * Magic link email template
   */
  magicLink: (link: string, email: string): EmailContent => ({
    to: email,
    subject: "Sign in to KwikSync",
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <h2 style="color: #333; margin-bottom: 20px;">Welcome to KwikSync!</h2>
        
        <p style="color: #666; margin-bottom: 20px;">
          Click the button below to sign in to your account. This link will expire in 30 minutes.
        </p>

        <div style="text-align: center; margin: 30px 0;">
          <a href="${link}" 
             style="display: inline-block; background-color: #007bff; color: white; 
                    padding: 12px 24px; text-decoration: none; border-radius: 4px;
                    font-weight: bold;">
            Sign in to KwikSync
          </a>
        </div>

        <p style="color: #666; margin-top: 20px;">
          If you didn't request this link, you can safely ignore this email.
        </p>

        <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee;">
          <p style="color: #999; font-size: 14px;">
            If the button doesn't work, copy and paste this link into your browser:
          </p>
          <p style="color: #666; font-size: 14px; word-break: break-all;">
            ${link}
          </p>
        </div>
      </div>
    `,
  }),

  /**
   * Welcome email template
   */
  welcome: (email: string): EmailContent => ({
    to: email,
    subject: "Welcome to KwikSync!",
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <h2 style="color: #333;">Welcome to KwikSync!</h2>
        <p style="color: #666;">
          Thank you for joining KwikSync. We're excited to help you manage your business more efficiently.
        </p>
        <p style="color: #666;">
          If you have any questions, feel free to reach out to our support team.
        </p>
      </div>
    `,
  }),
};

export const sendEmail = async (content: EmailContent): Promise<void> => {
  try {
    validateEmailContent(content);

    const mailOptions = {
      from: emailConfig.from,
      to: content.to,
      subject: content.subject,
      html: content.html,
      text: content.text || stripHtml(content.html),
      attachments: content.attachments,
    };

    const info = await transporter.sendMail(mailOptions);

    console.log("Email sent successfully:", {
      messageId: info.messageId,
      to: content.to,
      subject: content.subject,
    });
  } catch (error: any) {
    console.error("Failed to send email:", error);
    throw new CustomError("EMAIL_SEND_ERROR", "Failed to send email", 500, {
      originalError: error?.message || error,
    });
  }
};

/**
 * Strip HTML tags for text version
 */
const stripHtml = (html: string): string => {
  return html
    .replace(/<[^>]*>/g, "") // Remove HTML tags
    .replace(/\s+/g, " ") // Normalize whitespace
    .trim();
};
export const verifyEmailService = async (): Promise<boolean> => {
  try {
    await transporter.verify();
    console.log("Email service connection verified successfully");
    return true;
  } catch (error) {
    console.error("Email service verification failed:", error);
    throw ErrorFactory.server("Email service configuration error");
  }
};
const validateEmailContent = (content: EmailContent): void => {
  const errors: Record<string, string> = {};

  if (!content.to) {
    errors.to = "Recipient email is required";
  } else if (!isValidEmail(content.to)) {
    errors.to = "Invalid recipient email format";
  }

  if (!content.subject) {
    errors.subject = "Email subject is required";
  }

  if (!content.html) {
    errors.html = "Email HTML content is required";
  }

  if (Object.keys(errors).length > 0) {
    throw ErrorFactory.validation("Invalid email content", errors);
  }
};
const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};
