import "server-only";
import { Pool } from "pg";
import { headers } from "next/headers";
import { redirect, unstable_rethrow } from "next/navigation";
import { betterAuth } from "better-auth";
import { nextCookies } from "better-auth/next-js";
import { authOptions } from "./auth-config";

// Better Auth runs server-side only, through server actions (src/app/admin/actions.ts).
// Sessions live in Postgres; signing out deletes the row, so a copied cookie stops working.

function createAuth() {
  const connectionString = process.env.DATABASE_URL;
  if (!connectionString) throw new Error("DATABASE_URL is not set");
  const secret = process.env.BETTER_AUTH_SECRET;
  if (!secret || secret.length < 32) throw new Error("BETTER_AUTH_SECRET must be at least 32 characters");

  const options = authOptions(new Pool({ connectionString, max: 3, idleTimeoutMillis: 20_000 }));
  // nextCookies must be the last plugin: it lets server actions set the auth cookies.
  return betterAuth({ ...options, plugins: [...options.plugins, nextCookies()] });
}

type Auth = ReturnType<typeof createAuth>;

declare global {
  var __auth: Auth | undefined;
}

/** Created on first use, so builds don't need auth secrets. One instance per server. */
export function auth(): Auth {
  globalThis.__auth ??= createAuth();
  return globalThis.__auth;
}

export async function getSession() {
  // Read request headers outside the try: during prerendering this is how Next.js defers the
  // page to request time, and that signal must not be swallowed by the catch below.
  const h = await headers();
  try {
    return await auth().api.getSession({ headers: h });
  } catch (e) {
    unstable_rethrow(e);
    // Fail closed: if the session can't be checked, treat the visitor as signed out.
    console.error("admin: session_check_failed");
    return null;
  }
}

/** Signed in. Every admin page and every admin server action calls this. */
export async function requireAdmin() {
  const session = await getSession();
  if (!session) redirect("/admin/login");
  return session;
}
