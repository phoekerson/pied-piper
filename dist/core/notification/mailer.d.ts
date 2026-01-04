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
export declare function sendEmails(users: NormalizedUser[], smtpConfig: SMTPConfig, options?: EmailOptions): Promise<void>;
//# sourceMappingURL=mailer.d.ts.map