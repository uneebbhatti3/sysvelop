import type { MetadataRoute } from "next";
import { siteUrl } from "@/lib/seo";

// Testimonial links aren't listed here: they carry noindex, which crawlers must be able to read.
export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: "*", allow: "/", disallow: "/admin" },
    sitemap: `${siteUrl()}/sitemap.xml`,
  };
}
