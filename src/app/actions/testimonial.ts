"use server";

import { db } from "@/lib/db";
import { rateLimit } from "@/lib/rate-limit";
import { submissionSchema, type SubmissionInput } from "@/lib/testimonial-schema";

export type SubmissionResult = { ok: true } | { ok: false; reason: "invalid" | "limited" | "inactive" | "failed" };

export async function submitTestimonial(input: SubmissionInput): Promise<SubmissionResult> {
  const parsed = submissionSchema.safeParse(input);
  if (!parsed.success) return { ok: false, reason: "invalid" };
  const { token, website, name, role, company, quote } = parsed.data;
  if (website) return { ok: true }; // honeypot

  try {
    // Roomier than the contact form: several people at one client may share an office connection.
    if (!(await rateLimit("testimonial", 10, 600))) return { ok: false, reason: "limited" };

    // Inserts only while the link is active.
    const saved = await db()`
      insert into testimonials (source, name, role, company, quote)
      select 'client', ${name}, ${role}, ${company}, ${quote}
      from testimonial_link where token = ${token}
      returning id
    `;
    return saved.length ? { ok: true } : { ok: false, reason: "inactive" };
  } catch {
    console.error("testimonial: store_failed");
    return { ok: false, reason: "failed" };
  }
}
