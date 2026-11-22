import "server-only";
import { createHmac } from "node:crypto";
import { headers } from "next/headers";
import { db } from "./db";

/** Simple per-visitor limit. True while the visitor is within `limit` tries per window. */
export async function rateLimit(action: string, limit: number, windowSeconds: number) {
  const h = await headers();
  // The last forwarded address is the one our host added; earlier ones can be faked.
  const ip = h.get("x-vercel-forwarded-for") ?? h.get("x-forwarded-for")?.split(",").at(-1)?.trim() ?? "unknown";
  // Hashed, so raw IP addresses are never stored.
  const key = `${action}:${createHmac("sha256", process.env.BETTER_AUTH_SECRET ?? "").update(ip).digest("hex")}`;

  const sql = db();
  await sql`insert into rate_limit_hits (key) values (${key})`;
  const [{ count }] = await sql<{ count: number }[]>`
    select count(*)::int as count from rate_limit_hits
    where key = ${key} and hit_at > now() - make_interval(secs => ${windowSeconds})
  `;
  return count <= limit;
}
