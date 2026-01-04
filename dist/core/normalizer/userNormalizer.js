"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.normalizeUser = normalizeUser;
const ProviderDetector_1 = require("../identity/ProviderDetector");
function normalizeUser(row) {
    const email = row.email || row.mail || row["Email Address"] || null;
    if (!email) {
        throw new Error("Email is required");
    }
    return {
        email: email.toLowerCase().trim(),
        firstName: row.firstName || row.Prenom || null,
        lastName: row.lastName || row.Nom || null,
        password: row.password || row.Pass || null,
        provider: (0, ProviderDetector_1.detectProvider)(email),
        status: "pending"
    };
}
//# sourceMappingURL=userNormalizer.js.map