import { NormalizedUser } from "../../types/user";
import { DatabaseAdapter } from "./DatabaseAdapter";
/**
 * Default database adapter that logs users (for testing/development)
 */
export declare class DefaultDatabaseAdapter implements DatabaseAdapter {
    insertUsers(users: NormalizedUser[]): Promise<void>;
    userExists(email: string): Promise<boolean>;
}
//# sourceMappingURL=dbAdapter.d.ts.map