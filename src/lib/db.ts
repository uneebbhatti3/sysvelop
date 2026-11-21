import "server-only";
import postgres from "postgres";

// One client per server instance. Use Neon's *pooled* connection string in production.
// `prepare: false` keeps it compatible with Neon's PgBouncer pooler.

declare global {
  var __sql: postgres.Sql | undefined;
}

export function db(): postgres.Sql {
  const url = process.env.DATABASE_URL;
  if (!url) throw new Error("DATABASE_URL is not set");
  globalThis.__sql ??= postgres(url, { prepare: false, max: 5, idle_timeout: 20 });
  return globalThis.__sql;
}

/** Retention (docs/SECURITY.md §7): enquiries are deleted 12 months after they arrive. */
export const RETENTION = "12 months";

export async function purgeExpired() {
  const sql = db();
  await sql`delete from enquiries where created_at < now() - ${RETENTION}::interval`;
  await sql`delete from rate_limit_hits where hit_at < now() - interval '1 day'`;
  // Better Auth tables (created by npm run db:migrate).
  await sql`delete from "session" where "expiresAt" < now()`;
  await sql`delete from "verification" where "expiresAt" < now()`;
}

// Retention is days-granular, so running it at most once an hour per server instance is
// plenty. This stops every request that triggers it from adding two or three DELETEs.
const PURGE_EVERY_MS = 60 * 60 * 1000;
let lastPurge = 0;

/** Runs purgeExpired() unless this instance already ran it in the last hour. Never throws. */
export async function purgeExpiredThrottled() {
  const now = Date.now();
  if (now - lastPurge < PURGE_EVERY_MS) return;
  lastPurge = now;
  try {
    await purgeExpired();
  } catch {
    lastPurge = 0; // retry on the next call
    console.error("db: purge_failed");
  }
}
