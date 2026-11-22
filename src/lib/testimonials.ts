import "server-only";
import { cacheLife, cacheTag } from "next/cache";
import { ifMigrated } from "./content";
import { db } from "./db";
import type { TestimonialInput } from "./testimonial-schema";

export const TESTIMONIALS_TAG = "content:testimonials";

export type Testimonial = TestimonialInput & { id: string; source: "client" | "manual"; published: boolean; date: string };

/** Public: published testimonials only, cached like the rest of the site's content. */
export async function readTestimonials() {
  "use cache";
  cacheTag(TESTIMONIALS_TAG);
  const rows = await ifMigrated(
    () => db()<(TestimonialInput & { id: string })[]>`
      select id, name, role, company, quote from testimonials where published order by created_at desc
    `,
  );
  if (rows) cacheLife("hours");
  else cacheLife("minutes");
  return rows ? [...rows] : [];
}

/** Admin only: callers must requireAdmin() first. null means not migrated yet. */
export function getTestimonialsData() {
  return ifMigrated(async () => {
    const sql = db();
    const [items, [link]] = await Promise.all([
      sql<Testimonial[]>`
        select id, source, published, name, role, company, quote, to_char(created_at, 'FMDD Mon YYYY') as date
        from testimonials order by created_at desc
      `,
      sql<{ token: string }[]>`select token from testimonial_link`,
    ]);
    return { items: [...items], token: link?.token ?? null };
  });
}

export async function isLinkActive(token: string) {
  const rows = await ifMigrated(() => db()`select 1 from testimonial_link where token = ${token}`);
  return Boolean(rows?.length);
}
