export interface RawUser {
    [key: string]: any;
}
export interface NormalizedUser {
    email: string;
    firstName: string | null;
    lastName: string | null;
    password: string | null;
    provider: "google" | "microsoft" | "passwordless";
    status: "pending" | "active";
}
//# sourceMappingURL=user.d.ts.map