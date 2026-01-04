# PiedPiper

A TypeScript Node.js library for importing users in bulk from CSV or Excel files, normalizing data, preparing SSO-ready access, and optionally sending onboarding emails.

## Features

-  **Import from CSV/Excel**: Parse and import users from CSV or Excel files
-  **Data Normalization**: Automatically normalize user data with flexible field mapping
-  **SSO Provider Detection**: Automatically detects Google, Microsoft, or passwordless authentication providers
-  **Database Adapter Pattern**: Flexible database integration via adapters (Prisma, TypeORM, etc.)
-  **Optional Email Notifications**: Send onboarding emails to imported users
-  **Validation & Error Handling**: Comprehensive validation and error reporting
-  **TypeScript**: Fully typed for better developer experience

## Installation

```bash
npm install piedpiper
```

## Quick Start

```typescript
import { piedPiper } from 'piedpiper';

// Basic usage
const result = await piedPiper('./users.csv');
console.log(`Imported ${result.imported} users`);
```

## Usage

### Basic Import

```typescript
import { piedPiper } from 'piedpiper';

const result = await piedPiper('./users.csv');

console.log(result);
// {
//   imported: 10,
//   skipped: 2,
//   errors: [
//     { row: 3, error: "Email is required" },
//     { row: 7, error: "Invalid email format: invalid-email" }
//   ]
// }
```

### With Database Adapter

```typescript
import { piedPiper, DatabaseAdapter, NormalizedUser } from 'piedpiper';
import { PrismaClient } from '@prisma/client';

// Create your database adapter
class PrismaAdapter implements DatabaseAdapter {
  constructor(private prisma: PrismaClient) {}

  async insertUsers(users: NormalizedUser[]): Promise<void> {
    await this.prisma.user.createMany({
      data: users.map(user => ({
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        provider: user.provider,
        status: user.status,
      })),
    });
  }

  async userExists(email: string): Promise<boolean> {
    const user = await this.prisma.user.findUnique({
      where: { email },
    });
    return !!user;
  }
}

// Use with adapter
const prisma = new PrismaClient();
const adapter = new PrismaAdapter(prisma);

const result = await piedPiper('./users.xlsx', {
  databaseAdapter: adapter,
  skipDuplicates: true,
});
```

### With Email Notifications

```typescript
import { piedPiper } from 'piedpiper';

const result = await piedPiper('./users.csv', {
  emailConfig: {
    smtp: {
      host: 'smtp.gmail.com',
      port: 587,
      secure: false,
      auth: {
        user: 'your-email@gmail.com',
        pass: 'your-app-password',
      },
    },
    options: {
      subject: 'Welcome to our platform!',
      textTemplate: (user) => 
        `Hello ${user.firstName || 'there'},\n\n` +
        `Your account has been created. You can sign in using ${user.provider} authentication.\n\n` +
        `Email: ${user.email}\n\n` +
        `Best regards`
    },
  },
});
```

### Complete Example

```typescript
import { piedPiper, DatabaseAdapter, NormalizedUser } from 'piedpiper';

class MyDatabaseAdapter implements DatabaseAdapter {
  async insertUsers(users: NormalizedUser[]): Promise<void> {
    // Your database insertion logic
    for (const user of users) {
      await db.users.insert(user);
    }
  }

  async userExists(email: string): Promise<boolean> {
    const user = await db.users.findOne({ email });
    return !!user;
  }
}

const result = await piedPiper('./users.csv', {
  databaseAdapter: new MyDatabaseAdapter(),
  skipDuplicates: true,
  validateEmails: true,
  emailConfig: {
    smtp: {
      host: 'smtp.example.com',
      port: 587,
      auth: {
        user: 'noreply@example.com',
        pass: 'password',
      },
    },
  },
});

console.log(`✅ Imported: ${result.imported}`);
console.log(`⏭️  Skipped: ${result.skipped}`);
if (result.errors.length > 0) {
  console.log(`❌ Errors:`, result.errors);
}
```

## CSV/Excel Format

Your CSV or Excel file should contain user data with flexible column names. The library recognizes common variations:

### Supported Column Names

- **Email**: `email`, `mail`, `Email Address`
- **First Name**: `firstName`, `Prenom`, `first_name`
- **Last Name**: `lastName`, `Nom`, `last_name`
- **Password**: `password`, `Pass` (optional, for passwordless/SSO)

### Example CSV

```csv
email,firstName,lastName
john.doe@gmail.com,John,Doe
jane.smith@outlook.com,Jane,Smith
admin@company.com,Admin,User
```

## API Reference

### `piedPiper(filePath, options?)`

Main function to import users from a file.

**Parameters:**
- `filePath` (string): Path to CSV or Excel file (.csv, .xlsx, .xls)
- `options` (ImportOptions, optional): Import configuration

**Returns:** `Promise<ImportResult>`

### `ImportOptions`

```typescript
interface ImportOptions {
  databaseAdapter?: DatabaseAdapter;  // Custom database adapter
  emailConfig?: {                      // Email configuration
    smtp: SMTPConfig;
    options?: EmailOptions;
  };
  skipDuplicates?: boolean;            // Skip existing users (default: false)
  validateEmails?: boolean;            // Validate email format (default: true)
}
```

### `DatabaseAdapter`

Interface for database adapters:

```typescript
interface DatabaseAdapter {
  insertUsers(users: NormalizedUser[]): Promise<void>;
  userExists(email: string): Promise<boolean>;
}
```

### `NormalizedUser`

```typescript
interface NormalizedUser {
  email: string;
  firstName: string | null;
  lastName: string | null;
  password: string | null;
  provider: "google" | "microsoft" | "passwordless";
  status: "pending" | "active";
}
```

## SSO Provider Detection

The library automatically detects SSO providers based on email domains:

- **Google**: `gmail.com`, `googlemail.com`, `google.com`
- **Microsoft**: `outlook.com`, `hotmail.com`, `live.com`, `msn.com`, `microsoft.com`, `office365.com`
- **Passwordless**: All other domains

## Important Notes

⚠️ **This library does NOT manage authentication or passwords directly.** It only prepares user access and delegates authentication to providers like Google, Microsoft, or Magic Link.

## License

ISC

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

