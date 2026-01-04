/**
 * Example Prisma Database Adapter for PiedPiper
 * 
 * This example shows how to create a custom database adapter
 * using Prisma ORM.
 */

import { DatabaseAdapter, NormalizedUser } from '../src';
import { PrismaClient } from '@prisma/client';

export class PrismaDatabaseAdapter implements DatabaseAdapter {
  constructor(private prisma: PrismaClient) {}

  async insertUsers(users: NormalizedUser[]): Promise<void> {
    // Option 1: Create many (if your Prisma schema supports it)
    try {
      await this.prisma.user.createMany({
        data: users.map(user => ({
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
          provider: user.provider,
          status: user.status,
          // Add other fields as needed
        })),
        skipDuplicates: true, // Skip if user already exists
      });
    } catch (error) {
      // Option 2: Create individually if createMany doesn't work
      // or if you need more control
      for (const user of users) {
        try {
          await this.prisma.user.create({
            data: {
              email: user.email,
              firstName: user.firstName,
              lastName: user.lastName,
              provider: user.provider,
              status: user.status,
            },
          });
        } catch (err) {
          // Handle individual errors if needed
          console.error(`Failed to create user ${user.email}:`, err);
        }
      }
    }
  }

  async userExists(email: string): Promise<boolean> {
    const user = await this.prisma.user.findUnique({
      where: { email },
    });
    return !!user;
  }
}

// Usage example:
/*
import { piedPiper } from 'piedpiper';
import { PrismaClient } from '@prisma/client';
import { PrismaDatabaseAdapter } from './examples/prisma-adapter';

const prisma = new PrismaClient();
const adapter = new PrismaDatabaseAdapter(prisma);

const result = await piedPiper('./users.csv', {
  databaseAdapter: adapter,
  skipDuplicates: true,
});

await prisma.$disconnect();
*/

