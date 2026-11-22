import Image from "next/image";
import { ArrowUpRight } from "lucide-react";
import { work } from "@/content/site";
import { getProjects } from "@/content/projects";
import { SectionHeader } from "@/components/shared/section-header";
import { Stagger, StaggerItem } from "@/components/motion/reveal";

// Data-driven. Hidden while no case studies are published. Leads with results.
export async function Work() {
  const projects = await getProjects();
  if (projects.length === 0) return null;

  return (
    <section id="work" aria-labelledby="work-heading" className="border-t border-border py-24 md:py-32">
      <div className="container-x">
        <SectionHeader id="work-heading" eyebrow={work.eyebrow} heading={work.heading} />
        <Stagger as="ul" className="mt-12 grid gap-6 md:mt-16 md:grid-cols-2">
          {projects.map((p) => (
            <StaggerItem as="li" lift key={p.id} className="flex min-w-0 flex-col overflow-hidden rounded-lg border border-border bg-surface">
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
                {/* Wraps rather than fixed columns, so a long figure never breaks mid-word. */}
                <dl className="flex flex-wrap gap-x-8 gap-y-4">
                  {p.results.map((r) => (
                    <div key={r.label} className="flex max-w-full min-w-0 flex-col gap-1">
                      <dt className="order-2 text-sm break-words text-muted-foreground">{r.label}</dt>
                      <dd className="order-1 display text-4xl break-words">{r.value}</dd>
                    </div>
                  ))}
                </dl>
                <div className="flex flex-wrap items-center gap-3">
                  <h3 className="display max-w-full text-2xl break-words">{p.name}</h3>
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
            </StaggerItem>
          ))}
        </Stagger>
      </div>
    </section>
  );
}
