import fs from "fs";
import { parse } from "csv-parse/sync";

export function parseCSV(filePath: string): any[] {
  const content = fs.readFileSync(filePath);
  return parse(content, {
    columns: true,
    skip_empty_lines: true
  });
}
