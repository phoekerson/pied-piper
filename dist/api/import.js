"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.piedPiper = piedPiper;
const csvParser_1 = require("../core/parser/csvParser");
const excelParser_1 = require("../core/parser/excelParser");
const userNormalizer_1 = require("../core/normalizer/userNormalizer");
const dbAdapter_1 = require("../core/database/dbAdapter");
const mailer_1 = require("../core/notification/mailer");
/**
 * Main function to import users from CSV or Excel files
 * @param filePath Path to the CSV or Excel file
 * @param options Import options (database adapter, email config, etc.)
 * @returns Import result with statistics
 */
async function piedPiper(filePath, options) {
    const adapter = options?.databaseAdapter || new dbAdapter_1.DefaultDatabaseAdapter();
    const skipDuplicates = options?.skipDuplicates ?? false;
    const validateEmails = options?.validateEmails ?? true;
    // Parse file
    let rows;
    try {
        if (filePath.endsWith(".csv")) {
            rows = (0, csvParser_1.parseCSV)(filePath);
        }
        else if (filePath.endsWith(".xlsx") || filePath.endsWith(".xls")) {
            rows = (0, excelParser_1.parseExcel)(filePath);
        }
        else {
            throw new Error(`Unsupported file format. Expected .csv, .xlsx, or .xls`);
        }
    }
    catch (error) {
        throw new Error(`Failed to parse file: ${error instanceof Error ? error.message : String(error)}`);
    }
    if (rows.length === 0) {
        return { imported: 0, skipped: 0, errors: [] };
    }
    // Normalize users
    const users = [];
    const errors = [];
    for (let i = 0; i < rows.length; i++) {
        try {
            const user = (0, userNormalizer_1.normalizeUser)(rows[i]);
            // Validate email format
            if (validateEmails && !isValidEmail(user.email)) {
                errors.push({ row: i + 1, error: `Invalid email format: ${user.email}` });
                continue;
            }
            // Check for duplicates if enabled
            if (skipDuplicates) {
                const exists = await adapter.userExists(user.email);
                if (exists) {
                    errors.push({ row: i + 1, error: `User already exists: ${user.email}` });
                    continue;
                }
            }
            users.push(user);
        }
        catch (error) {
            errors.push({
                row: i + 1,
                error: error instanceof Error ? error.message : String(error)
            });
        }
    }
    // Insert users into database
    if (users.length > 0) {
        try {
            await adapter.insertUsers(users);
        }
        catch (error) {
            throw new Error(`Failed to insert users: ${error instanceof Error ? error.message : String(error)}`);
        }
    }
    // Send emails if configured
    if (options?.emailConfig && users.length > 0) {
        try {
            await (0, mailer_1.sendEmails)(users, options.emailConfig.smtp, options.emailConfig.options);
        }
        catch (error) {
            console.error("[PiedPiper] Failed to send emails:", error);
            // Don't throw - email failure shouldn't fail the import
        }
    }
    return {
        imported: users.length,
        skipped: errors.length,
        errors
    };
}
/**
 * Simple email validation
 */
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}
//# sourceMappingURL=import.js.map