import { z } from "zod";
import { getSession } from "@/lib/auth";
import { db } from "@/lib/db";

// Case study screenshots, stored in Postgres. A new upload gets a new id.
// Draft images are visible to the signed-in admin only.
export async function GET(_request: Request, { params }: RouteContext<"/work-image/[id]">) {
  const id = z.uuid().safeParse((await params).id);
  const notFound = () => new Response(null, { status: 404, headers: { "Cache-Control": "no-store" } });
  if (!id.success) return notFound();

  const [row] = await db()<{ image: Buffer; published: boolean }[]>`
    select image, published from case_studies where image_id = ${id.data}
  `;
  if (!row || (!row.published && !(await getSession()))) return notFound();

  return new Response(new Uint8Array(row.image), {
    headers: {
      "Content-Type": "image/jpeg",
      // An hour rather than forever, so unpublishing takes an image down.
      "Cache-Control": row.published ? "public, max-age=3600" : "private, no-store",
    },
  });
}
