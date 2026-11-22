import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { buttonVariants } from "@/components/ui/button-variants";
import { nav } from "@/content/site";
import { SplitText } from "./split-heading";

type Crumb = { label: string; href?: string };

// Inner-page hero: breadcrumb, accent label, oversized h1, intro, one action.
export function PageHero({
  crumbs,
  eyebrow,
  title,
  tail = 0,
  intro,
}: {
  crumbs: Crumb[];
  eyebrow: string;
  title: string;
  tail?: number;
  intro: string;
}) {
  return (
    <section aria-labelledby="page-heading" className="border-b border-border">
      <div className="container-x pt-8 pb-16 md:pt-10 md:pb-24">
        <nav aria-label="Breadcrumb" className="rise">
          <ol className="label flex flex-wrap items-center gap-x-3 text-muted-foreground">
            {crumbs.map((c, i) => (
              <li key={c.label} className="flex items-center gap-3">
                {i > 0 ? <span aria-hidden="true">/</span> : null}
                {c.href ? (
                  <Link href={c.href} className="inline-flex min-h-11 items-center hover:text-foreground">
                    {c.label}
                  </Link>
                ) : (
                  <span aria-current="page" className="text-foreground">
                    {c.label}
                  </span>
                )}
              </li>
            ))}
          </ol>
        </nav>

        <p style={{ "--d": "80ms" } as React.CSSProperties} className="rise label mt-12 text-signal-text md:mt-20">{eyebrow}</p>
        <div className="mt-7 grid gap-10 lg:grid-cols-12 lg:items-end lg:gap-8">
          <h1
            id="page-heading"
            className="display max-w-[14ch] text-[clamp(3rem,1.3rem+5.6vw,7rem)] text-balance lg:col-span-8"
          >
            <SplitText text={title} tail={tail} />
          </h1>
          <div style={{ "--d": "200ms" } as React.CSSProperties} className="rise flex flex-col items-start gap-8 lg:col-span-4">
            <p className="text-[17px] leading-[1.65] text-pretty text-muted-foreground md:text-lg">{intro}</p>
            <a href={nav.cta.href} className={buttonVariants({ size: "pill" })}>
              {nav.cta.label}
              <ArrowUpRight className="nudge size-4 text-[#9db1ff]" aria-hidden="true" />
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
