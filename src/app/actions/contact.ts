"use server";

import { after } from "next/server";
import { contactSchema, type ContactInput } from "@/lib/schema";
import { db, purgeExpiredThrottled } from "@/lib/db";
import { rateLimit } from "@/lib/rate-limit";

export type ContactResult = { ok: true } | { ok: false };

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
    // 3. Spam limit: 5 per 10 minutes per visitor.
    if (!(await rateLimit("contact", 5, 600))) return { ok: false };

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
