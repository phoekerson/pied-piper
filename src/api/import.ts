import { parseCSV } from "../core/parser/csvParser";
import { parseExcel } from "../core/parser/excelParser";
import { normalizeUser } from "../core/normalizer/userNormalizer";
import { DefaultDatabaseAdapter } from "../core/database/dbAdapter";
import { sendEmails } from "../core/notification/mailer";
import { ImportOptions } from "../types/options";
import { NormalizedUser } from "../types/user";

export interface ImportResult {
  imported: number;
  skipped: number;
  errors: Array<{ row: number; error: string }>;
}

/**
 * Main function to import users from CSV or Excel files
 * @param filePath Path to the CSV or Excel file
 * @param options Import options (database adapter, email config, etc.)
 * @returns Import result with statistics
 */
export async function piedPiper(
  filePath: string,
  options?: ImportOptions
): Promise<ImportResult> {
  const adapter = options?.databaseAdapter || new DefaultDatabaseAdapter();
  const skipDuplicates = options?.skipDuplicates ?? false;
  const validateEmails = options?.validateEmails ?? true;

  // Parse file
  let rows: any[];
  try {
    if (filePath.endsWith(".csv")) {
      rows = parseCSV(filePath);
    } else if (filePath.endsWith(".xlsx") || filePath.endsWith(".xls")) {
      rows = parseExcel(filePath);
    } else {
      throw new Error(`Unsupported file format. Expected .csv, .xlsx, or .xls`);
    }
  } catch (error) {
    throw new Error(`Failed to parse file: ${error instanceof Error ? error.message : String(error)}`);
  }

  if (rows.length === 0) {
    return { imported: 0, skipped: 0, errors: [] };
  }

  // Normalize users
  const users: NormalizedUser[] = [];
  const errors: Array<{ row: number; error: string }> = [];

  for (let i = 0; i < rows.length; i++) {
    try {
      const user = normalizeUser(rows[i]);
      
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
    } catch (error) {
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
    } catch (error) {
      throw new Error(
        `Failed to insert users: ${error instanceof Error ? error.message : String(error)}`
      );
    }
  }

  // Send emails if configured
  if (options?.emailConfig && users.length > 0) {
    try {
      await sendEmails(users, options.emailConfig.smtp, options.emailConfig.options);
    } catch (error) {
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
function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}
