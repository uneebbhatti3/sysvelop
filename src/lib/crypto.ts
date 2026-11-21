import "server-only";
import { createHmac } from "node:crypto";

function secret() {
  const s = process.env.BETTER_AUTH_SECRET;
  if (!s || s.length < 32) throw new Error("BETTER_AUTH_SECRET must be at least 32 characters");
  return s;
}

/** Keyed hash for rate-limit keys, so raw IPs are never stored. */
export function hashKey(kind: string, value: string) {
  return createHmac("sha256", secret()).update(`${kind}:${value.toLowerCase()}`).digest("base64url");
}
