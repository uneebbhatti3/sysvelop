"use server";

import { after } from "next/server";
import { headers } from "next/headers";
import { contactSchema, type ContactInput } from "@/lib/schema";
import { db, purgeExpiredThrottled } from "@/lib/db";
import { hashKey } from "@/lib/crypto";
import { clientIp, rateLimit } from "@/lib/rate-limit";

export type ContactResult = { ok: true } | { ok: false };

// Submission limits (docs/SECURITY.md §3). The honeypot only stops bots that fill in the HTML
// form; a script can call this action directly, so these limits are the real flood control.
const PER_IP = { limit: 5, windowSeconds: 10 * 60 }; // 5 per 10 minutes per visitor
const GLOBAL = { limit: 200, windowSeconds: 60 * 60 }; // 200 per hour across the site

// docs/TRD.md §6. Next.js server actions only accept POST and reject cross-origin requests
// (Origin must match Host), which covers the same-site check in docs/SECURITY.md §3.
// Logs carry event codes only, never personal data.
export async function submitContact(input: ContactInput): Promise<ContactResult> {
  // 1. Honeypot: pretend it worked so bots learn nothing.
  if (typeof input?.website === "string" && input.website.length > 0) return { ok: true };

  // 2. Server-side validation with the shared schema.
  const parsed = contactSchema.safeParse(input);
  if (!parsed.success) return { ok: false };
  const data = parsed.data;

  try {
    // 3. Rate limit, per hashed IP and site-wide. Generic failure on limit.
    const ip = clientIp(await headers());
    const perIp = await rateLimit(hashKey("contact", ip), PER_IP.limit, PER_IP.windowSeconds);
    if (!perIp.ok) {
      console.error("contact: rate_limited");
      return { ok: false };
    }
    const global = await rateLimit(hashKey("contact", "*global*"), GLOBAL.limit, GLOBAL.windowSeconds);
    if (!global.ok) {
      console.error("contact: global_rate_limited");
      return { ok: false };
    }

    // 4. Store. Enquiries are read in the admin dashboard; there is no email notification.
    await db()`
      insert into enquiries (name, email, company, need, message)
      values (${data.name}, ${data.email}, ${data.company}, ${data.need}, ${data.message})
    `;

    // 5. Apply the 12-month retention after the response is sent (at most hourly).
    after(purgeExpiredThrottled);

    return { ok: true };
  } catch {
    console.error("contact: store_failed");
    return { ok: false };
  }
}
