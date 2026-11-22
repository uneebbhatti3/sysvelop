"use server";

import { randomUUID } from "node:crypto";
import { refresh } from "next/cache";
import { z } from "zod";
import { requireAdmin } from "@/lib/auth";
import { contentTag } from "@/lib/content";
import { expireContent } from "@/lib/content-cache";
import {
  LIMITS,
  caseStudyDraft,
  caseStudyPublishErrors,
  contentKinds,
  fieldErrors,
  serviceDraft,
  servicePublishErrors,
  type CaseStudyInput,
  type ContentKind,
  type FieldErrors,
  type ServiceInput,
} from "@/lib/content-schema";
import { db } from "@/lib/db";
import { jpegSize } from "@/lib/jpeg";

// Every export is a public POST endpoint: check the session first, then treat every argument
// as untrusted. Logs carry event codes only.

export type ContentResult = { ok: true } | { ok: false; message: string; errors?: FieldErrors };

const FAILED = { ok: false, message: "That didn't save. Try again." } as const;
const INVALID = { ok: false, message: "That request wasn't valid." } as const;
const CONFLICT = {
  ok: false,
  message: "This was changed or deleted in another tab. Copy your edits, then reload the page.",
} as const;

const invalidFields = (errors: FieldErrors) => ({ ok: false, message: "Fix the highlighted fields.", errors }) as const;

const tables = { "case-studies": "case_studies", services: "services" } as const;
const target = z.object({ kind: z.enum(contentKinds), id: z.uuid() });
// No id means create. An edit must say which version it was based on.
const saveMeta = z.object({
  id: z.uuid().nullable(),
  version: z.number().int().nonnegative(),
  published: z.boolean(),
});

function changed(kind: ContentKind): ContentResult {
  expireContent(contentTag(kind));
  refresh();
  return { ok: true };
}

export async function saveCaseStudy(
  meta: z.input<typeof saveMeta>,
  input: CaseStudyInput,
  image: FormData | "remove" | null,
): Promise<ContentResult> {
  await requireAdmin();
  const m = saveMeta.safeParse(meta);
  if (!m.success) return INVALID;
  const parsed = caseStudyDraft.safeParse(input);
  if (!parsed.success) return invalidFields(fieldErrors(parsed.error));
  const { id, version, published } = m.data;
  const data = parsed.data;

  // undefined = keep the current image, null = remove it.
  let next: { bytes: Buffer; id: string; width: number; height: number } | null | undefined;
  if (image === "remove") next = null;
  else if (image instanceof FormData) {
    const file = image.get("image");
    if (!(file instanceof Blob) || file.size > LIMITS.imageBytes) return invalidFields({ image: "That image is too large." });
    const bytes = Buffer.from(await file.arrayBuffer());
    const size = jpegSize(bytes);
    if (!size || Math.max(size.width, size.height) > LIMITS.imageEdge) {
      return invalidFields({ image: "That image couldn't be read." });
    }
    next = { bytes, id: randomUUID(), ...size };
  } else if (image !== null) return INVALID;

  try {
    const result = await db().begin(async (tx): Promise<ContentResult> => {
      let hasImage = Boolean(next);
      if (id) {
        const [row] = await tx<{ version: number; imageId: string | null }[]>`
          select version, image_id as "imageId" from case_studies where id = ${id} for update
        `;
        if (!row || row.version !== version) return CONFLICT;
        if (next === undefined) hasImage = row.imageId !== null;
      }
      if (published) {
        const errors = caseStudyPublishErrors(data, hasImage);
        if (Object.keys(errors).length) return invalidFields(errors);
      }

      const json = tx.json(data);
      const [saved] = id
        ? await tx<{ id: string }[]>`
            update case_studies set data = ${json}, published = ${published}, version = version + 1, updated_at = now()
            where id = ${id} returning id
          `
        : await tx<{ id: string }[]>`
            insert into case_studies (data, published) values (${json}, ${published}) returning id
          `;

      if (next !== undefined) {
        await tx`
          update case_studies set image = ${next?.bytes ?? null}, image_id = ${next?.id ?? null},
            image_width = ${next?.width ?? null}, image_height = ${next?.height ?? null}
          where id = ${saved.id}
        `;
      }
      return { ok: true };
    });
    if (!result.ok) return result;
  } catch {
    console.error("admin: save_case_study_failed");
    return FAILED;
  }
  return changed("case-studies");
}

export async function saveService(meta: z.input<typeof saveMeta>, input: ServiceInput): Promise<ContentResult> {
  await requireAdmin();
  const m = saveMeta.safeParse(meta);
  if (!m.success) return INVALID;
  const parsed = serviceDraft.safeParse(input);
  if (!parsed.success) return invalidFields(fieldErrors(parsed.error));
  const { id, version, published } = m.data;
  if (published) {
    const errors = servicePublishErrors(parsed.data);
    if (Object.keys(errors).length) return invalidFields(errors);
  }

  const { slug, ...data } = parsed.data;
  try {
    const sql = db();
    // The slug is only written on create, so a live URL can't change underneath its links.
    const rows = id
      ? await sql`
          update services set data = ${sql.json(data)}, published = ${published}, version = version + 1, updated_at = now()
          where id = ${id} and version = ${version} returning id
        `
      : await sql`
          insert into services (slug, data, published) values (${slug}, ${sql.json(data)}, ${published})
          on conflict (slug) do nothing returning id
        `;
    if (!rows.length) return id ? CONFLICT : invalidFields({ slug: "Another service already uses this address." });
  } catch {
    console.error("admin: save_service_failed");
    return FAILED;
  }
  return changed("services");
}

export async function setPublished(kind: ContentKind, id: string, published: boolean): Promise<ContentResult> {
  await requireAdmin();
  const parsed = target.extend({ published: z.boolean() }).safeParse({ kind, id, published });
  if (!parsed.success) return INVALID;
  const t = parsed.data;

  try {
    const result = await db().begin(async (tx): Promise<ContentResult> => {
      const [row] = await tx`select * from ${tx(tables[t.kind])} where id = ${t.id} for update`;
      if (!row) return CONFLICT;

      if (t.published) {
        let errors: FieldErrors;
        if (t.kind === "services") {
          const item = serviceDraft.safeParse({ ...row.data, slug: row.slug });
          errors = item.success ? servicePublishErrors(item.data) : fieldErrors(item.error);
        } else {
          const item = caseStudyDraft.safeParse(row.data);
          errors = item.success ? caseStudyPublishErrors(item.data, row.image_id !== null) : fieldErrors(item.error);
        }
        if (Object.keys(errors).length) return { ok: false, message: "Not ready to publish. Open it to finish the details." };
      }

      await tx`
        update ${tx(tables[t.kind])} set published = ${t.published}, version = version + 1, updated_at = now()
        where id = ${t.id}
      `;
      return { ok: true };
    });
    if (!result.ok) return result;
  } catch {
    console.error("admin: publish_failed");
    return FAILED;
  }
  return changed(t.kind);
}

export async function moveContent(kind: ContentKind, id: string, direction: "up" | "down"): Promise<ContentResult> {
  await requireAdmin();
  const parsed = target.extend({ direction: z.enum(["up", "down"]) }).safeParse({ kind, id, direction });
  if (!parsed.success) return INVALID;
  const t = parsed.data;

  try {
    await db().begin(async (tx) => {
      const table = tx(tables[t.kind]);
      const rows = await tx<{ id: string; position: number; group: string | null }[]>`
        select id, position, data->>'group' as "group" from ${table} order by position for update
      `;
      const item = rows.find((r) => r.id === t.id);
      if (!item) return;
      // Services only move within their own Build / Automate / Grow group.
      const peers = rows.filter((r) => r.group === item.group);
      const other = peers[peers.indexOf(item) + (t.direction === "up" ? -1 : 1)];
      if (!other) return;
      await tx`update ${table} set position = ${other.position} where id = ${item.id}`;
      await tx`update ${table} set position = ${item.position} where id = ${other.id}`;
    });
  } catch {
    console.error("admin: move_failed");
    return FAILED;
  }
  return changed(t.kind);
}

export async function deleteContent(kind: ContentKind, id: string): Promise<ContentResult> {
  await requireAdmin();
  const parsed = target.safeParse({ kind, id });
  if (!parsed.success) return INVALID;

  try {
    const sql = db();
    await sql`delete from ${sql(tables[parsed.data.kind])} where id = ${parsed.data.id}`;
  } catch {
    console.error("admin: delete_content_failed");
    return FAILED;
  }
  return changed(parsed.data.kind);
}
