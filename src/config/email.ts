import { smtpServerCreds } from ".";
const { smtpPassword, smtpUser, smtpHost, smtpPort, smtpSecure, emailFrom } =
  smtpServerCreds;
export const emailConfig: EmailConfig = {
  host: smtpHost!,
  port: parseInt(smtpPort!),
  secure: !!smtpSecure!,
  auth: {
    user: smtpUser!,
    pass: smtpPassword!,
  },
  from: emailFrom!,
};
