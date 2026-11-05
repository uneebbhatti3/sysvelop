import { CodeXml, TrendingUp, Workflow, type LucideIcon } from "lucide-react";
import { services } from "@/content/site";
import { SectionHeader } from "@/components/shared/section-header";

const icons: Record<(typeof services.groups)[number]["id"], LucideIcon> = {
  build: CodeXml,
  automate: Workflow,
  grow: TrendingUp,
};

export function Services() {
  return (
    <section id="services" aria-labelledby="services-heading" className="border-t border-border py-24 md:py-32">
      <div className="container-x">
        <SectionHeader id="services-heading" eyebrow={services.eyebrow} heading={services.heading} />

        <ul className="mt-12 grid gap-4 md:mt-16 md:gap-6 lg:grid-cols-3">
          {services.groups.map((group, i) => {
            const Icon = icons[group.id];
            return (
              <li key={group.id} className="card-surface flex flex-col p-7 md:p-8">
                <div className="flex items-center justify-between">
                  <span className="flex size-12 items-center justify-center rounded-xl border border-border-strong bg-[linear-gradient(180deg,rgb(31_75_255/0.22),rgb(31_75_255/0.05))]">
                    <Icon className="size-5 text-signal-text" strokeWidth={1.75} aria-hidden="true" />
                  </span>
                  <span aria-hidden="true" className="font-mono text-[13px] text-white/30">
                    0{i + 1}
                  </span>
                </div>
                <h3 className="mt-8 text-2xl font-[560] tracking-[-0.02em]">{group.title}</h3>
                <p className="mt-3 text-base leading-relaxed text-muted-foreground">{group.line}</p>
                <ul className="mt-7 flex flex-col border-t border-border pt-5">
                  {group.items.map((item) => (
                    <li key={item} className="flex items-start gap-3 py-2 text-[15px] leading-snug text-foreground/90">
                      <span aria-hidden="true" className="mt-[7px] size-1.5 shrink-0 rounded-full bg-signal-text" />
                      {item}
                    </li>
                  ))}
                </ul>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
