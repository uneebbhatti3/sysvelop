"use server";

import { randomBytes } from "node:crypto";
import { refresh } from "next/cache";
import { z } from "zod";
import { requireAdmin } from "@/lib/auth";
import { expireContent } from "@/lib/content-cache";
import { copyProblem } from "@/lib/content-schema";
import { db } from "@/lib/db";
import { testimonialSchema, type TestimonialInput } from "@/lib/testimonial-schema";
import { TESTIMONIALS_TAG } from "@/lib/testimonials";

type Result = { ok: true } | { ok: false; message?: string };

function changed(): Result {
  expireContent(TESTIMONIALS_TAG);
  refresh();
  return { ok: true };
}

export async function saveTestimonial(id: string | null, input: TestimonialInput): Promise<Result> {
  await requireAdmin();
  const parsed = z.object({ id: z.uuid().nullable(), input: testimonialSchema }).safeParse({ id, input });
  if (!parsed.success) return { ok: false };
  const { name, role, company, quote } = parsed.data.input;
  const problem = copyProblem(quote);
  try {
    const sql = db();
    // Only your own entries are editable: a client's words stay as they wrote them.
    // A quote that breaks the copy rules can't stay published.
    const saved = parsed.data.id
      ? await sql`
          update testimonials
          set name = ${name}, role = ${role}, company = ${company}, quote = ${quote},
            published = published and ${!problem}
          where id = ${parsed.data.id} and source = 'manual' returning id
        `
      : await sql`
          insert into testimonials (source, name, role, company, quote)
          values ('manual', ${name}, ${role}, ${company}, ${quote}) returning id
        `;
    if (!saved.length) return { ok: false };
  } catch {
    console.error("admin: save_testimonial_failed");
    return { ok: false };
  }
  return changed();
}

/** Nothing a client sends is public until it is published here. */
export async function setTestimonialPublished(id: string, published: boolean): Promise<Result> {
  await requireAdmin();
  const parsed = z.object({ id: z.uuid(), published: z.boolean() }).safeParse({ id, published });
  if (!parsed.success) return { ok: false };
  try {
    const sql = db();
    const [row] = await sql<{ quote: string }[]>`select quote from testimonials where id = ${parsed.data.id}`;
    if (!row) return { ok: false };
    // The name and role are the client's own words, so only the quote is checked.
    const problem = parsed.data.published ? copyProblem(row.quote) : undefined;
    if (problem) return { ok: false, message: `Can't publish. ${problem}` };
    // `quote` is compared so an edit made meanwhile can't go live unchecked.
    const saved = await sql`
      update testimonials set published = ${parsed.data.published}
      where id = ${parsed.data.id} and quote = ${row.quote} returning id
    `;
    if (!saved.length) return { ok: false };
  } catch {
    console.error("admin: publish_testimonial_failed");
    return { ok: false };
  }
  return changed();
}

export async function deleteTestimonial(id: string): Promise<Result> {
  await requireAdmin();
  const parsed = z.uuid().safeParse(id);
  if (!parsed.success) return { ok: false };
  try {
    await db()`delete from testimonials where id = ${parsed.data}`;
  } catch {
    console.error("admin: delete_testimonial_failed");
    return { ok: false };
  }
  return changed();
}

/** Creates the share link, or replaces it, which stops the old one working. */
export async function createLink(): Promise<Result> {
  await requireAdmin();
  const token = randomBytes(16).toString("base64url");
  try {
    await db()`insert into testimonial_link (token) values (${token}) on conflict (id) do update set token = excluded.token`;
  } catch {
    console.error("admin: create_link_failed");
    return { ok: false };
  }
  refresh();
  return { ok: true };
}

export async function turnOffLink(): Promise<Result> {
  await requireAdmin();
  try {
    await db()`delete from testimonial_link`;
  } catch {
    console.error("admin: turn_off_link_failed");
    return { ok: false };
  }
  refresh();
  return { ok: true };
}
