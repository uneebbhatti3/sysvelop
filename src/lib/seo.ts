import type { Metadata } from "next";
import { seo, site } from "@/content/site";

/** The site's public origin, without a trailing slash. Never hard-coded (PRD Open Decision #3). */
export function siteUrl() {
  const vercel = process.env.VERCEL_PROJECT_PRODUCTION_URL;
  // Vercel's value comes before BETTER_AUTH_URL, which is often left on localhost.
  const url = process.env.NEXT_PUBLIC_SITE_URL || vercel || process.env.BETTER_AUTH_URL || "http://localhost:3000";
  return (/^https?:\/\//.test(url) ? url : `https://${url}`).replace(/\/+$/, "");
}

/** Title, description, canonical, Open Graph and Twitter tags for a public page. */
export function pageMetadata({
  title,
  description,
  path,
  shareTitle = title,
  shareDescription = description,
}: {
  title: string;
  description: string;
  path: string;
  shareTitle?: string;
  shareDescription?: string;
}): Metadata {
  // A page's openGraph replaces the root's, so the image has to be named here.
  const image = { url: "/opengraph-image", width: 1200, height: 630, alt: seo.ogTitle };
  return {
    title,
    description,
    alternates: { canonical: path },
    openGraph: { type: "website", siteName: site.name, url: path, title: shareTitle, description: shareDescription, images: [image] },
    twitter: { card: "summary_large_image", title: shareTitle, description: shareDescription, images: [image] },
  };
}
