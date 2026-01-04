"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.parseCSV = parseCSV;
const fs_1 = __importDefault(require("fs"));
const sync_1 = require("csv-parse/sync");
function parseCSV(filePath) {
    const content = fs_1.default.readFileSync(filePath);
    return (0, sync_1.parse)(content, {
        columns: true,
        skip_empty_lines: true
    });
}
//# sourceMappingURL=csvParser.js.map