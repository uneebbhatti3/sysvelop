import { readFileSync } from "node:fs";
import { join } from "node:path";
import { ImageResponse } from "next/og";
import { seo, site } from "@/content/site";

// Share image: dark background, logo, tagline (docs/CONTENT.md, SEO and metadata).
export const alt = seo.ogTitle;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpenGraphImage() {
  // Read synchronously so the image is generated once, at build time.
  const logo = readFileSync(join(process.cwd(), "public/brand/logo-light.png")).toString("base64");

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: 80,
          background: "#1b1b1b",
          color: "#f7f7f4",
        }}
      >
        {/* Rendered into a PNG by next/og, which only understands a plain img. */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={`data:image/png;base64,${logo}`} width={320} height={70} alt="" />
        <div style={{ display: "flex", maxWidth: 1000, fontSize: 92, lineHeight: 1, letterSpacing: -3 }}>{site.tagline}</div>
      </div>
    ),
    size,
  );
}
