"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.detectProvider = detectProvider;
/**
 * Detects the SSO provider based on email domain
 * @param email User email address
 * @returns Provider type: "google", "microsoft", or "passwordless"
 */
function detectProvider(email) {
    if (!email || !email.includes("@")) {
        return "passwordless";
    }
    const domain = email.split("@")[1]?.toLowerCase();
    if (!domain) {
        return "passwordless";
    }
    // Google domains
    const googleDomains = ["gmail.com", "googlemail.com", "google.com"];
    if (googleDomains.includes(domain)) {
        return "google";
    }
    // Microsoft domains
    const microsoftDomains = [
        "outlook.com",
        "hotmail.com",
        "live.com",
        "msn.com",
        "microsoft.com",
        "office365.com"
    ];
    if (microsoftDomains.includes(domain)) {
        return "microsoft";
    }
    // Check for Google Workspace or Microsoft 365 custom domains
    // (This is a simple check - in production, you might want more sophisticated detection)
    if (domain.endsWith(".gmail.com") || domain.includes("google")) {
        return "google";
    }
    if (domain.includes("microsoft") || domain.includes("office")) {
        return "microsoft";
    }
    return "passwordless";
}
//# sourceMappingURL=ProviderDetector.js.map