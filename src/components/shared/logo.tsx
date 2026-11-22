import Image from "next/image";
import { cn } from "@/lib/utils";
import { uiLabels } from "@/content/site";
import logoDark from "../../../public/brand/logo.png";
import logoLight from "../../../public/brand/logo-light.png";

type Tone = "dark" | "light";

// Official logo (430x94, so sharp on 4x screens). "light" has paper lettering, for ink bands.
// Unoptimised: the files are under 8 KB, and recompressing softens the lettering.
export function LogoImage({ tone = "dark", className }: { tone?: Tone; className?: string }) {
  return (
    <Image
      src={tone === "light" ? logoLight : logoDark}
      alt=""
      unoptimized
      loading={tone === "light" ? "lazy" : "eager"}
      className={cn("h-6 w-auto shrink-0", className)}
    />
  );
}

export function Logo({ className, href = "/", tone }: { className?: string; href?: string; tone?: Tone }) {
  return (
    <a href={href} aria-label={uiLabels.homeLink} className={cn("inline-flex h-11 w-fit shrink-0 items-center rounded-md", className)}>
      <LogoImage tone={tone} />
    </a>
  );
}
