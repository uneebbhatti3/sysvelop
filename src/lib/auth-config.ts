// Better Auth options shared by the app (src/lib/auth.ts) and the Node scripts
// (scripts/db-migrate.mjs, scripts/admin-user.mjs), so the database schema and the admin
// account are always created from the same config the app runs with.
// Keep this file free of path aliases and Next.js-only imports: Node runs it directly.
import type { Pool } from "pg";
import type { BetterAuthOptions } from "better-auth";

export const SESSION_MAX_AGE = 60 * 60 * 8; // 8 hours, then sign in again
export const MIN_PASSWORD_LENGTH = 12;

export function authOptions(pool: Pool) {
  return {
    appName: "Sysvelop Admin",
    database: pool,
    secret: process.env.BETTER_AUTH_SECRET,
    baseURL: process.env.BETTER_AUTH_URL || process.env.NEXT_PUBLIC_SITE_URL || undefined,
    emailAndPassword: {
      enabled: true,
      // Single admin, created with `npm run admin:create`. Nobody can register.
      disableSignUp: true,
      minPasswordLength: MIN_PASSWORD_LENGTH,
      maxPasswordLength: 200,
    },
    session: {
      expiresIn: SESSION_MAX_AGE,
      // Fixed lifetime: an active session is not silently extended past 8 hours.
      disableSessionRefresh: true,
    },
    // No /api/auth HTTP handler is mounted; every auth call goes through our server actions,
    // which apply their own Postgres rate limits (src/lib/rate-limit.ts).
    rateLimit: { enabled: false },
    advanced: {
      cookiePrefix: "sv",
      useSecureCookies: process.env.NODE_ENV === "production",
      ipAddress: { ipAddressHeaders: ["x-vercel-forwarded-for", "x-real-ip"] },
    },
    telemetry: { enabled: false },
    plugins: [],
  } satisfies BetterAuthOptions;
}
