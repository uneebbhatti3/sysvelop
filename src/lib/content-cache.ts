import "server-only";
import { revalidateTag, updateTag } from "next/cache";
import { after } from "next/server";

// Longer than a page takes to regenerate, including a Neon cold start.
const SETTLE_MS = 5000;

/** Call from a server action after changing content the public site shows. */
export function expireContent(tag: string) {
  updateTag(tag);
  // Expire once more after the response. Next.js dates a regenerated page by when it finished,
  // so one that read the database just before this save and finished just after updateTag would
  // count as fresh and serve the old content for 15 minutes.
  after(async () => {
    await new Promise((resolve) => setTimeout(resolve, SETTLE_MS));
    revalidateTag(tag, { expire: 0 });
  });
}
