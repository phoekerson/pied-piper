import { DatabaseAdapter } from "../core/database/DatabaseAdapter";
import { SMTPConfig, EmailOptions } from "../core/notification/mailer";
export interface ImportOptions {
    /**
     * Database adapter to use for inserting users
     * If not provided, uses DefaultDatabaseAdapter (logs only)
     */
    databaseAdapter?: DatabaseAdapter;
    /**
     * SMTP configuration for sending onboarding emails
     * If provided, emails will be sent to all imported users
     */
    emailConfig?: {
        smtp: SMTPConfig;
        options?: EmailOptions;
    };
    /**
     * Skip duplicate users (check by email)
     * Default: false
     */
    skipDuplicates?: boolean;
    /**
     * Validate email format before processing
     * Default: true
     */
    validateEmails?: boolean;
}
//# sourceMappingURL=options.d.ts.map