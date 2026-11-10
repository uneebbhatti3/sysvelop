import { technologies } from "@/content/site";
import { SectionHeader } from "@/components/shared/section-header";

export function Technologies() {
  return (
    <section id="technologies" aria-labelledby="technologies-heading" className="py-24 md:py-40">
      <div className="container-x">
        <SectionHeader id="technologies-heading" eyebrow={technologies.eyebrow} heading={technologies.heading} tail={2} />
        <dl className="mt-16 border-t border-foreground/80 md:mt-24">
          {technologies.groups.map((g, i) => (
            <div key={g.name} className="grid gap-4 border-b border-border py-7 md:grid-cols-[5rem_1fr_2fr] md:items-center md:gap-6">
              <span aria-hidden="true" className="hidden text-xs tracking-[0.12em] text-signal-text md:block">
                0{i + 1}
              </span>
              <dt className="display text-[26px] leading-none tracking-[-0.035em]">{g.name}</dt>
              <dd>
                <ul className="flex flex-wrap gap-2">
                  {g.items.map((t) => (
                    <li key={t} className="rounded-full border border-border bg-surface px-4 py-2 text-sm">
                      {t}
                    </li>
                  ))}
                </ul>
              </dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}
