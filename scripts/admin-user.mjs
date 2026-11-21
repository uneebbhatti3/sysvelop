// Creates the single admin account, or resets it if you're locked out.
//   npm run admin:create   first-time setup (refuses if an admin already exists)
//   npm run admin:reset    new password, signs out every session
// After either, sign in at /admin/login.
// Passwords are typed at a hidden prompt, never passed as arguments (no shell history).
import { createInterface } from "node:readline/promises";
import pg from "pg";
import { betterAuth } from "better-auth";
import { authOptions, MIN_PASSWORD_LENGTH } from "../src/lib/auth-config.ts";

const mode = process.argv[2];
if (mode !== "create" && mode !== "reset") {
  console.error("Usage: node scripts/admin-user.mjs <create|reset>");
  process.exit(1);
}
for (const name of ["DATABASE_URL", "BETTER_AUTH_SECRET"]) {
  if (!process.env[name]) {
    console.error(`${name} is not set (add it to .env.local).`);
    process.exit(1);
  }
}
if (process.env.BETTER_AUTH_SECRET.length < 32) {
  console.error("BETTER_AUTH_SECRET must be at least 32 characters.");
  process.exit(1);
}

const tty = Boolean(process.stdin.isTTY);
const rl = createInterface({ input: process.stdin, output: process.stdout, terminal: tty });
// Piped input (not a terminal): read line by line, so lines that arrive early aren't lost.
const lines = tty ? null : rl[Symbol.asyncIterator]();
async function ask(question, { hidden = false } = {}) {
  if (lines) {
    process.stdout.write(question + (hidden ? "\n" : ""));
    const { value = "" } = await lines.next();
    return hidden ? value.normalize("NFKC") : value.trim();
  }
  if (!hidden) return (await rl.question(question)).trim();
  // Mute echo while the password is typed.
  const write = rl._writeToOutput;
  rl._writeToOutput = (s) => (s.startsWith(question) ? write.call(rl, question) : undefined);
  const answer = await rl.question(question);
  rl._writeToOutput = write;
  process.stdout.write("\n");
  return answer.normalize("NFKC");
}

const pool = new pg.Pool({ connectionString: process.env.DATABASE_URL, max: 1 });
const auth = betterAuth(authOptions(pool));

try {
  const ctx = await auth.$context;
  const email = (await ask("Admin email: ")).toLowerCase();
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) throw new Error("That doesn't look like an email address.");

  const password = await ask(`New password (${MIN_PASSWORD_LENGTH}+ characters): `, { hidden: true });
  if (password.length < MIN_PASSWORD_LENGTH) throw new Error(`Use at least ${MIN_PASSWORD_LENGTH} characters.`);
  if ((await ask("Repeat password: ", { hidden: true })) !== password) throw new Error("Passwords don't match.");
  const hash = await ctx.password.hash(password);

  if (mode === "create") {
    const { rows } = await pool.query('select count(*)::int as n from "user"');
    if (rows[0].n > 0) throw new Error("An admin already exists. Use `npm run admin:reset` instead.");
    const user = await ctx.internalAdapter.createUser({ email, name: "Admin", emailVerified: true });
    await ctx.internalAdapter.linkAccount({ userId: user.id, providerId: "credential", accountId: user.id, password: hash });
    console.log(`\nAdmin ${email} created. Sign in at /admin/login.`);
  } else {
    const user = await ctx.internalAdapter.findUserByEmail(email);
    if (!user) throw new Error("No admin with that email.");
    const userId = user.user.id;
    await ctx.internalAdapter.updatePassword(userId, hash);
    await pool.query('delete from "session" where "userId" = $1', [userId]);
    console.log("\nPassword reset and all sessions signed out. Sign in at /admin/login.");
  }
} catch (e) {
  console.error(`\n${e instanceof Error ? e.message : "Failed."}`);
  process.exitCode = 1;
} finally {
  rl.close();
  await pool.end();
}
