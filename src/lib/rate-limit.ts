import "server-only";
import { db } from "./db";

/**
 * Sliding-window limit stored in Postgres. Records the attempt and reports whether the key
 * is still within `limit` attempts in the last `windowSeconds`. Keys must already be hashed.
 *
 * A transaction-scoped advisory lock per key serialises concurrent attempts, so a burst of
 * parallel requests can't all read the same stale count and slip past the limit.
 */
export async function rateLimit(key: string, limit: number, windowSeconds: number) {
  const count = await db().begin(async (tx) => {
    await tx`select pg_advisory_xact_lock(hashtextextended(${key}, 0))`;
    await tx`insert into rate_limit_hits (key) values (${key})`;
    const [row] = await tx<{ count: number }[]>`
      select count(*)::int as count
      from rate_limit_hits
      where key = ${key} and hit_at > now() - make_interval(secs => ${windowSeconds})
    `;
    return row.count;
  });
  return { ok: count <= limit };
}

/**
 * Client IP for rate limiting. Prefers headers the platform sets and a client can't forge:
 * `x-vercel-forwarded-for` on Vercel, otherwise the right-most `x-forwarded-for` entry (the
 * address our own proxy saw). The left-most entry is client-supplied and never trusted.
 */
export function clientIp(h: Headers) {
  const vercel = h.get("x-vercel-forwarded-for")?.split(",")[0]?.trim();
  if (vercel) return vercel;
  const chain = h.get("x-forwarded-for")?.split(",").map((s) => s.trim()).filter(Boolean);
  return chain?.at(-1) || h.get("x-real-ip") || "unknown";
}
