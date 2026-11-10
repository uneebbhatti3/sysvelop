import { why } from "@/content/site";
import { SectionHeader } from "@/components/shared/section-header";

export function Why() {
  return (
    <section aria-labelledby="why-heading" className="py-24 md:py-40">
      <div className="container-x">
        <SectionHeader id="why-heading" eyebrow={why.eyebrow} heading={why.heading} tail={6} intro={why.intro} />
        <ol className="mt-16 grid gap-4 sm:grid-cols-2 md:mt-24 lg:grid-cols-4 lg:gap-5">
          {why.cards.map((card, i) => (
            <li
              key={card.id}
              className="flex min-h-[19rem] flex-col rounded-[3px] border border-border bg-[linear-gradient(160deg,#ffffff_0%,var(--tint)_100%)] p-6"
            >
              <span className="flex size-9 items-center justify-center rounded-full border border-border bg-background text-xs font-medium tracking-[0.08em]">
                0{i + 1}
              </span>
              <h3 className="display mt-auto pt-10 text-[clamp(1.75rem,1.4rem+1vw,2.25rem)] leading-[1] tracking-[-0.04em]">
                {card.title}
              </h3>
              <p className="mt-5 border-b border-border pb-5 text-[15px] leading-relaxed text-muted-foreground">{card.text}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
