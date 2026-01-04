import { RawUser, NormalizedUser } from "../../types/user";
import { detectProvider } from "../identity/ProviderDetector";

export function normalizeUser(row: RawUser): NormalizedUser {
  const email =
    row.email || row.mail || row["Email Address"] || null;

  if (!email) {
    throw new Error("Email is required");
  }

  return {
    email: email.toLowerCase().trim(),
    firstName: row.firstName || row.Prenom || null,
    lastName: row.lastName || row.Nom || null,
    password: row.password || row.Pass || null,
    provider: detectProvider(email),
    status: "pending"
  };
}
