import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { services } from "@/content/site";
import { serviceHref, servicesInGroup } from "@/content/services";
import { SectionHeader } from "@/components/shared/section-header";
import { cn } from "@/lib/utils";

// Oversized numbered service rows, grouped by Build / Automate / Grow. Each row links to its page.
// On /services the page hero carries the heading, so `showHeader` is off there.
export function Services({ showHeader = true, className }: { showHeader?: boolean; className?: string }) {
  const GroupHeading = showHeader ? "h3" : "h2";
  const ItemHeading = showHeader ? "h4" : "h3";
  const numbered = services.groups.map((g) => servicesInGroup(g.id));
  const offsets = numbered.map((_, i) => numbered.slice(0, i).reduce((sum, list) => sum + list.length, 0));

  return (
    <section
      id="services"
      aria-labelledby={showHeader ? "services-heading" : undefined}
      aria-label={showHeader ? undefined : services.eyebrow}
      className={cn("border-t border-border py-24 md:py-40", className)}
    >
      <div className="container-x">
        {showHeader ? (
          <SectionHeader id="services-heading" eyebrow={services.eyebrow} heading={services.heading} tail={2} />
        ) : null}

        <div className={cn("flex flex-col gap-16 md:gap-24", showHeader && "mt-20 md:mt-32")}>
          {services.groups.map((g, gi) => (
            <div key={g.id} id={g.id} className="scroll-mt-24">
              <div className="flex flex-col gap-2 pb-6 sm:flex-row sm:items-baseline sm:justify-between">
                <GroupHeading className="label text-signal-text">{g.title}</GroupHeading>
                <p className="max-w-[46ch] text-[15px] leading-relaxed text-muted-foreground sm:text-right">{g.line}</p>
              </div>
              <ul className="border-t border-foreground/80">
                {numbered[gi].map((item, i) => (
                  <li key={item.slug} className="border-b border-border">
                    <Link
                      href={serviceHref(item.slug)}
                      className="group grid grid-cols-[2.5rem_1fr_auto] items-center gap-x-4 py-7 md:grid-cols-[5rem_1fr_minmax(0,22rem)_auto] md:gap-x-6 md:py-9"
                    >
                      <span className="text-xs tracking-[0.12em] text-signal-text">
                        {String(offsets[gi] + i + 1).padStart(2, "0")}
                      </span>
                      <ItemHeading className="display text-[clamp(1.75rem,1rem+2.8vw,3.75rem)] leading-[1] tracking-[-0.045em] transition-colors group-hover:text-signal-text">
                        {item.name}
                      </ItemHeading>
                      <p className="col-start-2 mt-3 text-sm leading-relaxed text-muted-foreground md:col-start-3 md:mt-0">
                        {item.summary}
                      </p>
                      <span className="col-start-3 row-start-1 flex size-11 items-center justify-center rounded-full border border-border transition-colors group-hover:border-signal group-hover:bg-signal group-hover:text-white md:col-start-4">
                        <ArrowUpRight className="size-4" aria-hidden="true" />
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
