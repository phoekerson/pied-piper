import { ImportOptions } from "../types/options";
export interface ImportResult {
    imported: number;
    skipped: number;
    errors: Array<{
        row: number;
        error: string;
    }>;
}
/**
 * Main function to import users from CSV or Excel files
 * @param filePath Path to the CSV or Excel file
 * @param options Import options (database adapter, email config, etc.)
 * @returns Import result with statistics
 */
export declare function piedPiper(filePath: string, options?: ImportOptions): Promise<ImportResult>;
//# sourceMappingURL=import.d.ts.map