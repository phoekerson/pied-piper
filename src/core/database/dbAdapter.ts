import { NormalizedUser } from "../../types/user";
import { DatabaseAdapter } from "./DatabaseAdapter";

/**
 * Default database adapter that logs users (for testing/development)
 */
export class DefaultDatabaseAdapter implements DatabaseAdapter {
  async insertUsers(users: NormalizedUser[]): Promise<void> {
    console.log(`[PiedPiper] Would insert ${users.length} users:`, users);
    // In a real implementation, this would insert into your database
  }

  async userExists(email: string): Promise<boolean> {
    return false; // Default implementation assumes no users exist
  }
}
