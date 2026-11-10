import Image from "next/image";
import { ArrowUpRight } from "lucide-react";
import { work } from "@/content/site";
import { projects } from "@/content/projects";
import { SectionHeader } from "@/components/shared/section-header";

// Data-driven. Hidden while src/content/projects.ts is empty. Leads with results.
export function Work() {
  if (projects.length === 0) return null;

  return (
    <section id="work" aria-labelledby="work-heading" className="border-t border-border py-24 md:py-32">
      <div className="container-x">
        <SectionHeader id="work-heading" eyebrow={work.eyebrow} heading={work.heading} />
        <ul className="mt-12 grid gap-6 md:mt-16 md:grid-cols-2">
          {projects.map((p) => (
            <li key={p.slug} className="flex flex-col overflow-hidden rounded-lg border border-border bg-surface">
              {p.image ? (
                <div className="overflow-hidden border-b border-border">
                  <Image
                    src={p.image.src}
                    width={p.image.width}
                    height={p.image.height}
                    alt={p.image.alt}
                    sizes="(min-width: 768px) 50vw, 100vw"
                    className="h-auto w-full"
                  />
                </div>
              ) : null}
              <div className="flex flex-1 flex-col gap-5 p-7">
                <dl className="grid grid-cols-2 gap-4 sm:grid-cols-3">
                  {p.results.map((r) => (
                    <div key={r.label} className="flex flex-col gap-1">
                      <dt className="order-2 text-sm text-muted-foreground">{r.label}</dt>
                      <dd className="order-1 display text-4xl">{r.value}</dd>
                    </div>
                  ))}
                </dl>
                <div className="flex items-center gap-3">
                  <h3 className="display text-2xl">{p.name}</h3>
                  <span className="rounded-full border border-border px-2.5 py-1 text-[12px] text-muted-foreground">
                    {p.kind}
                  </span>
                </div>
                <p className="text-base leading-relaxed text-muted-foreground">{p.summary}</p>
                <ul className="mt-auto flex flex-wrap gap-2">
                  {p.stack.map((s) => (
                    <li key={s} className="rounded-md bg-surface-raised px-2 py-1 text-[12px] text-muted-foreground">
                      {s}
                    </li>
                  ))}
                </ul>
                {p.url ? (
                  <a href={p.url} rel="noopener noreferrer" target="_blank" className="inline-flex items-center gap-1 text-sm text-signal-text hover:underline">
                    {p.name}
                    <ArrowUpRight className="size-4" aria-hidden="true" />
                  </a>
                ) : null}
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
