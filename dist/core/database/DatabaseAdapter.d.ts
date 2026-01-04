import { NormalizedUser } from "../../types/user";
/**
 * Interface for database adapters.
 * Implement this interface to integrate with your database (Prisma, TypeORM, etc.)
 */
export interface DatabaseAdapter {
    /**
     * Insert users into the database
     * @param users Array of normalized users to insert
     * @returns Promise that resolves when users are inserted
     */
    insertUsers(users: NormalizedUser[]): Promise<void>;
    /**
     * Check if a user with the given email already exists
     * @param email Email address to check
     * @returns Promise that resolves to true if user exists, false otherwise
     */
    userExists(email: string): Promise<boolean>;
}
//# sourceMappingURL=DatabaseAdapter.d.ts.map