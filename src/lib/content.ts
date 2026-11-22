import "server-only";
import { cacheLife, cacheTag } from "next/cache";
import type { Project } from "@/content/projects";
import { serviceList, type Service } from "@/content/services";
import type { CaseStudyInput, ContentKind, ServiceInput } from "./content-schema";
import { db } from "./db";

// Reads for dashboard-managed content. Public reads are cached, so pages stay static; every
// admin write expires the tag (src/app/admin/content-actions.ts).

export const contentTag = (kind: ContentKind) => `content:${kind}`;

/** Postgres "undefined_table": npm run db:migrate hasn't been run for this feature yet. */
function tableMissing(e: unknown) {
  return (e as { code?: unknown } | null)?.code === "42P01";
}

/**
 * Resolves to null when there is no content database yet (no DATABASE_URL, or not migrated).
 * Any other failure throws, so an outage can't be cached as "no content".
 */
export async function ifMigrated<T>(read: () => Promise<T>): Promise<T | null> {
  if (!process.env.DATABASE_URL) return null;
  try {
    return await read();
  } catch (e) {
    if (tableMissing(e)) return null;
    throw e;
  }
}

export async function readServices(): Promise<Service[]> {
  "use cache";
  cacheTag(contentTag("services"));
  const rows = await ifMigrated(
    () => db()<{ slug: string; data: Omit<Service, "slug"> }[]>`
      select slug, data from services where published order by position
    `,
  );
  // Short life for the fallback, so a later migration is picked up without a redeploy.
  if (rows) cacheLife("hours");
  else cacheLife("minutes");
  return rows ? rows.map((r) => ({ ...r.data, slug: r.slug })) : serviceList;
}

export async function readProjects(): Promise<Project[]> {
  "use cache";
  cacheTag(contentTag("case-studies"));
  const rows = await ifMigrated(
    () => db()<{ id: string; data: CaseStudyInput; imageId: string | null; width: number; height: number }[]>`
      select id, data, image_id as "imageId", image_width as width, image_height as height
      from case_studies where published order by position
    `,
  );
  if (rows) cacheLife("hours");
  else cacheLife("minutes");

  return (rows ?? []).flatMap(({ id, data, imageId, width, height }) => {
    const { kind, imageAlt, url, ...rest } = data;
    if (!kind) return []; // can't be published without a label; this narrows the type
    return {
      ...rest,
      id,
      kind,
      url: url || undefined,
      image: imageId ? { src: `/work-image/${imageId}`, width, height, alt: imageAlt } : undefined,
    };
  });
}

// Admin reads below: never cached. Callers must requireAdmin() first.

type Row<T> = { id: string; published: boolean; version: number; data: T };
export type CaseStudyRow = Row<CaseStudyInput> & { imageId: string | null };
export type ServiceRow = Row<Omit<ServiceInput, "slug">> & { slug: string };

/** null means the tables don't exist yet. */
export function listCaseStudies() {
  return ifMigrated(
    () => db()<CaseStudyRow[]>`
      select id, published, version, data, image_id as "imageId" from case_studies order by position
    `,
  );
}

/** null means the tables don't exist yet. */
export function listServices() {
  return ifMigrated(
    () => db()<ServiceRow[]>`select id, slug, published, version, data from services order by position`,
  );
}
