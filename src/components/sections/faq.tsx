import { ChevronDown } from "lucide-react";
import { faq } from "@/content/faq";
import { SectionHeader } from "@/components/shared/section-header";
import { Reveal } from "@/components/motion/reveal";

// Native <details>: keyboard support and one-open-at-a-time (`name`) with no JavaScript.
export function Faq() {
  return (
    <section id="faq" aria-labelledby="faq-heading" className="border-t border-border py-24 md:py-40">
      <div className="container-x grid gap-12 lg:grid-cols-12 lg:gap-8">
        <SectionHeader
          id="faq-heading"
          eyebrow={faq.eyebrow}
          heading={faq.heading}
          tail={1}
          stacked
          className="lg:col-span-4"
        />
        <Reveal className="lg:col-span-7 lg:col-start-6">
          {faq.items.map((item, i) => (
            <details key={item.q} name="faq" className="group border-b border-border first:border-t first:border-t-foreground/80">
              <summary className="flex cursor-pointer list-none items-center justify-between gap-6 py-7 text-left [&::-webkit-details-marker]:hidden">
                <h3 className="flex items-baseline gap-5 md:gap-8">
                  <span className="text-xs tracking-[0.12em] text-signal-text">0{i + 1}</span>
                  <span className="display text-[clamp(1.25rem,1rem+0.8vw,1.75rem)] leading-tight tracking-[-0.03em]">{item.q}</span>
                </h3>
                <ChevronDown
                  className="size-4 shrink-0 text-muted-foreground transition-transform duration-300 group-open:rotate-180"
                  aria-hidden="true"
                />
              </summary>
              <p className="max-w-[60ch] pb-7 pl-10 text-base leading-relaxed text-muted-foreground group-open:animate-in group-open:fade-in-0 md:pl-14">
                {item.a}
              </p>
            </details>
          ))}
        </Reveal>
      </div>
    </section>
  );
}
