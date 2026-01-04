"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.parseExcel = parseExcel;
const xlsx_1 = __importDefault(require("xlsx"));
function parseExcel(filePath) {
    const workbook = xlsx_1.default.readFile(filePath);
    const sheet = workbook.Sheets[workbook.SheetNames[0]];
    return xlsx_1.default.utils.sheet_to_json(sheet);
}
//# sourceMappingURL=excelParser.js.map