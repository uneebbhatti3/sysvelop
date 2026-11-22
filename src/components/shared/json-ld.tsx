import { site } from "@/content/site";
import { siteUrl } from "@/lib/seo";

// Organization + WebSite (docs/TRD.md §7). Built only from our own constants, never user input.
export function JsonLd() {
  const url = siteUrl();
  const data = {
    "@context": "https://schema.org",
    "@graph": [
      { "@type": "Organization", name: site.name, url, logo: `${url}/brand/logo.png`, description: site.oneLiner },
      { "@type": "WebSite", name: site.name, url },
    ],
  };
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(data).replace(/</g, "\\u003c") }} />;
}
