// Applies db/schema.sql, copies the built-in services into the database the first time, then
// creates or updates Better Auth's tables (user, session, account, verification) from the same
// config the app uses. Idempotent.
// Usage: npm run db:migrate   (reads .env / .env.local if present)
import { readFile } from "node:fs/promises";
import postgres from "postgres";
import pg from "pg";
import { getMigrations } from "better-auth/db/migration";
import { authOptions } from "../src/lib/auth-config.ts";
import { serviceList } from "../src/content/services.ts";

const url = process.env.DATABASE_URL;
if (!url) {
  console.error("DATABASE_URL is not set (add it to .env.local).");
  process.exit(1);
}

const sql = postgres(url, { prepare: false, max: 1, onnotice: () => {} });
try {
  const schema = await readFile(new URL("../db/schema.sql", import.meta.url), "utf8");
  // One transaction, so the live site never sees a services table that hasn't been filled yet.
  const seeded = await sql.begin(async (tx) => {
    await tx.unsafe(schema);
    const claimed = await tx`insert into content_seeds (key) values ('services') on conflict do nothing returning key`;
    if (!claimed.length) return 0;
    for (const { slug, ...data } of serviceList) {
      await tx`
        insert into services (slug, data, published) values (${slug}, ${tx.json(data)}, true)
        on conflict (slug) do nothing
      `;
    }
    return serviceList.length;
  });
  console.log("App schema applied.");
  if (seeded) console.log(`Copied ${seeded} services into the database. Edit them in /admin/services.`);
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
