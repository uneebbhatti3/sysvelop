// Applies db/schema.sql, then creates or updates Better Auth's tables (user, session, account,
// verification) from the same config the app uses. Idempotent.
// Usage: npm run db:migrate   (reads .env / .env.local if present)
import { readFile } from "node:fs/promises";
import postgres from "postgres";
import pg from "pg";
import { getMigrations } from "better-auth/db/migration";
import { authOptions } from "../src/lib/auth-config.ts";

const url = process.env.DATABASE_URL;
if (!url) {
  console.error("DATABASE_URL is not set (add it to .env.local).");
  process.exit(1);
}

const sql = postgres(url, { prepare: false, max: 1, onnotice: () => {} });
try {
  await sql.unsafe(await readFile(new URL("../db/schema.sql", import.meta.url), "utf8"));
  console.log("App schema applied.");
} finally {
  await sql.end();
}

const pool = new pg.Pool({ connectionString: url, max: 1 });
try {
  const { toBeCreated, toBeAdded, runMigrations } = await getMigrations(authOptions(pool));
  if (toBeCreated.length || toBeAdded.length) {
    await runMigrations();
    const tables = [...toBeCreated, ...toBeAdded].map((t) => t.table);
    console.log(`Auth schema applied (${[...new Set(tables)].join(", ")}).`);
  } else {
    console.log("Auth schema already up to date.");
  }
} finally {
  await pool.end();
}
