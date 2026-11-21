import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowUpRight, Check } from "lucide-react";
import { services } from "@/content/site";
import { getService, serviceHref, serviceList, servicePageLabels } from "@/content/services";
import { PageHero } from "@/components/shared/page-hero";
import { SectionHeader } from "@/components/shared/section-header";
import { Engagements } from "@/components/sections/engagements";
import { Cta } from "@/components/sections/cta";
import { Stagger, StaggerItem } from "@/components/motion/reveal";

export function generateStaticParams() {
  return serviceList.map((s) => ({ slug: s.slug }));
}

export async function generateMetadata({ params }: PageProps<"/services/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const service = getService(slug);
  if (!service) return {};
  return { title: `${service.name} | Sysvelop`, description: service.summary };
}

export default async function ServicePage({ params }: PageProps<"/services/[slug]">) {
  const { slug } = await params;
  const service = getService(slug);
  if (!service) notFound();

  const group = services.groups.find((g) => g.id === service.group)!;
  const related = service.related.map(getService).filter((s) => s !== undefined);

  return (
    <>
      <PageHero
        crumbs={[
          { label: servicePageLabels.breadcrumbHome, href: "/" },
          { label: servicePageLabels.breadcrumbServices, href: "/services" },
          { label: service.name },
        ]}
        eyebrow={group.title}
        title={service.name}
        intro={service.intro}
      />

      <section aria-labelledby="included-heading" className="py-24 md:py-40">
        <div className="container-x">
          <SectionHeader id="included-heading" eyebrow={servicePageLabels.included} heading={service.summary} stacked className="max-w-5xl" />
          <Stagger as="ol" className="mt-16 grid gap-4 sm:grid-cols-2 md:mt-24 lg:grid-cols-4 lg:gap-5">
            {service.included.map((item, i) => (
              <StaggerItem
                as="li"
                lift
                key={item.title}
                className="flex min-h-[18rem] flex-col rounded-[3px] border border-border transition-colors duration-300 hover:border-foreground/30 bg-[linear-gradient(160deg,#ffffff_0%,var(--tint)_100%)] p-6"
              >
                <span className="flex size-9 items-center justify-center rounded-full border border-border bg-background text-xs font-medium tracking-[0.08em]">
                  0{i + 1}
                </span>
                <h3 className="display mt-auto pt-10 text-[clamp(1.6rem,1.3rem+0.9vw,2rem)] leading-[1] tracking-[-0.04em]">
                  {item.title}
                </h3>
                <p className="mt-5 border-b border-border pb-5 text-[15px] leading-relaxed text-muted-foreground">{item.text}</p>
              </StaggerItem>
            ))}
          </Stagger>
        </div>
      </section>

      <section
        aria-labelledby="fit-heading"
        className="bg-band py-24 [--muted-foreground:#3f4250] md:py-32"
      >
        <div className="container-x grid gap-10 lg:grid-cols-12 lg:gap-8">
          <h2 id="fit-heading" className="label self-start text-signal-text lg:col-span-4 lg:pt-3">
            {servicePageLabels.fit}
          </h2>
          <Stagger as="ul" className="flex flex-col lg:col-span-8">
            {service.fit.map((line) => (
              <StaggerItem
                as="li"
                key={line}
                className="display flex items-start gap-5 border-b border-foreground/20 py-7 text-[clamp(1.5rem,1.1rem+1.4vw,2.5rem)] leading-[1.08] tracking-[-0.035em] first:border-t first:border-t-foreground/60"
              >
                <span className="mt-1 flex size-8 shrink-0 items-center justify-center rounded-full bg-signal text-white">
                  <Check className="size-4" strokeWidth={2.5} aria-hidden="true" />
                </span>
                {line}
              </StaggerItem>
            ))}
          </Stagger>
        </div>
      </section>

      <section aria-labelledby="related-heading" className="py-24 md:py-40">
        <div className="container-x">
          <div className="flex flex-wrap items-end justify-between gap-6">
            <h2 id="related-heading" className="display text-[clamp(2.5rem,1.6rem+3vw,4.5rem)]">
              {servicePageLabels.related}
            </h2>
            <Link href="/services" className="label inline-flex min-h-11 items-center text-signal-text hover:underline">
              {servicePageLabels.allServices}
            </Link>
          </div>
          <Stagger as="ul" stagger={0.07} className="mt-12 border-t border-foreground/80">
            {related.map((r) => (
              <StaggerItem as="li" key={r.slug} className="border-b border-border">
                <Link
                  href={serviceHref(r.slug)}
                  className="group grid grid-cols-[1fr_auto] items-center gap-x-6 gap-y-3 py-7 md:grid-cols-[1fr_minmax(0,22rem)_auto] md:py-9"
                >
                  <h3 className="display text-[clamp(1.6rem,1rem+2vw,3rem)] leading-[1] tracking-[-0.045em] transition-[color,transform] duration-300 group-hover:text-signal-text motion-safe:group-hover:translate-x-2">
                    {r.name}
                  </h3>
                  <p className="col-start-1 text-sm leading-relaxed text-muted-foreground md:col-start-2 md:row-start-1">{r.summary}</p>
                  <span className="col-start-2 row-start-1 flex size-11 items-center justify-center rounded-full border border-border transition-colors group-hover:border-signal group-hover:bg-signal group-hover:text-white md:col-start-3">
                    <ArrowUpRight className="size-4 transition-transform duration-300 motion-safe:group-hover:rotate-45" aria-hidden="true" />
                  </span>
                </Link>
              </StaggerItem>
            ))}
          </Stagger>
        </div>
      </section>

      <Engagements />
      <Cta />
    </>
  );
}
