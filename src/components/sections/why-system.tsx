import { why } from "@/content/site";
import { SectionHeader } from "@/components/shared/section-header";
import { AutomationDiagram, BookingDiagram, FindableDiagram, SpeedDiagram } from "@/components/shared/diagrams";
import { cn } from "@/lib/utils";

const visuals = {
  speed: SpeedDiagram,
  booking: BookingDiagram,
  automation: AutomationDiagram,
  findable: FindableDiagram,
} as const;

// Uneven bento on desktop (7/5, then 5/7); single column on mobile.
const spans = ["lg:col-span-7", "lg:col-span-5", "lg:col-span-5", "lg:col-span-7"];

export function WhySystem() {
  return (
    <section aria-labelledby="why-heading" className="py-24 md:py-32">
      <div className="container-x">
        <SectionHeader id="why-heading" eyebrow={why.eyebrow} heading={why.heading} intro={why.intro} />

        <ul className="mt-12 grid gap-4 md:mt-16 md:grid-cols-2 md:gap-6 lg:grid-cols-12">
          {why.cards.map((card, i) => {
            const Visual = visuals[card.id];
            return (
              <li key={card.id} className={cn("card-surface flex flex-col overflow-hidden", spans[i])}>
                <div className="relative flex h-60 items-center justify-center overflow-hidden border-b border-border bg-[radial-gradient(70%_80%_at_50%_100%,rgb(31_75_255/0.10),transparent_70%)] px-8 py-8 sm:px-10">
                  <div
                    aria-hidden="true"
                    className="absolute inset-0 bg-[radial-gradient(rgb(255_255_255/0.06)_1px,transparent_1px)] [background-size:16px_16px] [mask-image:radial-gradient(70%_70%_at_50%_50%,#000,transparent)]"
                  />
                  <div className="relative h-full w-full">
                    <Visual />
                  </div>
                </div>
                <div className="flex flex-col gap-2 p-6 md:p-7">
                  <h3 className="text-lg leading-snug font-[550] tracking-[-0.01em] md:text-xl">{card.title}</h3>
                  <p className="max-w-[52ch] text-base leading-relaxed text-muted-foreground">{card.text}</p>
                </div>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
