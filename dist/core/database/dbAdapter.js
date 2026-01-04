"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DefaultDatabaseAdapter = void 0;
/**
 * Default database adapter that logs users (for testing/development)
 */
class DefaultDatabaseAdapter {
    async insertUsers(users) {
        console.log(`[PiedPiper] Would insert ${users.length} users:`, users);
        // In a real implementation, this would insert into your database
    }
    async userExists(email) {
        return false; // Default implementation assumes no users exist
    }
}
exports.DefaultDatabaseAdapter = DefaultDatabaseAdapter;
//# sourceMappingURL=dbAdapter.js.map