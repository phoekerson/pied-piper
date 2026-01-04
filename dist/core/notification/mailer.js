"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendEmails = sendEmails;
const nodemailer_1 = __importDefault(require("nodemailer"));
/**
 * Send onboarding emails to users
 * @param users Array of normalized users to send emails to
 * @param smtpConfig SMTP configuration for nodemailer
 * @param options Email options (subject, templates)
 */
async function sendEmails(users, smtpConfig, options) {
    const transporter = nodemailer_1.default.createTransport(smtpConfig);
    const defaultSubject = options?.subject || "Your account access is ready";
    const defaultTextTemplate = options?.textTemplate ||
        ((user) => `Hello ${user.firstName || "there"},\n\n` +
            `Your account has been set up. You can access it using ${user.provider} authentication.\n\n` +
            `Email: ${user.email}\n\n` +
            `Best regards`);
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
        }
        catch (error) {
            console.error(`[PiedPiper] Failed to send email to ${user.email}:`, error);
            // Continue with other users even if one fails
        }
    }
}
//# sourceMappingURL=mailer.js.map