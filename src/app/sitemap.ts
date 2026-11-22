import type { MetadataRoute } from "next";
import { serviceHref } from "@/content/services";
import { readServices } from "@/lib/content";
import { siteUrl } from "@/lib/seo";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = siteUrl();
  const paths = ["/", "/services", ...(await readServices()).map((s) => serviceHref(s.slug))];
  return paths.map((path) => ({ url: `${base}${path}` }));
}
