import nodemailer, { Transporter } from "nodemailer";
import { NormalizedUser } from "../../types/user";

export interface SMTPConfig {
  host: string;
  port: number;
  secure?: boolean;
  auth: {
    user: string;
    pass: string;
  };
}

export interface EmailOptions {
  subject?: string;
  htmlTemplate?: (user: NormalizedUser) => string;
  textTemplate?: (user: NormalizedUser) => string;
}

/**
 * Send onboarding emails to users
 * @param users Array of normalized users to send emails to
 * @param smtpConfig SMTP configuration for nodemailer
 * @param options Email options (subject, templates)
 */
export async function sendEmails(
  users: NormalizedUser[],
  smtpConfig: SMTPConfig,
  options?: EmailOptions
): Promise<void> {
  const transporter: Transporter = nodemailer.createTransport(smtpConfig);

  const defaultSubject = options?.subject || "Your account access is ready";
  const defaultTextTemplate = options?.textTemplate || 
    ((user: NormalizedUser) => 
      `Hello ${user.firstName || "there"},\n\n` +
      `Your account has been set up. You can access it using ${user.provider} authentication.\n\n` +
      `Email: ${user.email}\n\n` +
      `Best regards`
    );

  for (const user of users) {
    try {
      const text = options?.textTemplate 
        ? options.textTemplate(user)
        : defaultTextTemplate(user);
      
      const html = options?.htmlTemplate 
        ? options.htmlTemplate(user)
        : undefined;

      await transporter.sendMail({
        from: smtpConfig.auth.user,
        to: user.email,
        subject: defaultSubject,
        text,
        html
      });
    } catch (error) {
      console.error(`[PiedPiper] Failed to send email to ${user.email}:`, error);
      // Continue with other users even if one fails
    }
  }
}
