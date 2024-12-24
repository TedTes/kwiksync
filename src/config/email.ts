export const emailConfig: EmailConfig = {
  host: process.env.SMTP_HOST || "smtp.sendgrid.net",
  port: parseInt(process.env.SMTP_PORT || "587"),
  secure: process.env.SMTP_SECURE === "true",
  auth: {
    user: process.env.SMTP_USER || "apikey",
    pass: process.env.SMTP_PASS || "",
  },
  from: process.env.EMAIL_FROM || "tedtfu@gmail.com",
};
