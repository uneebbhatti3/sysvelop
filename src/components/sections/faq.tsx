import { faq } from "@/content/faq";
import { SectionHeader } from "@/components/shared/section-header";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Reveal } from "@/components/motion/reveal";

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
        <Accordion>
          {faq.items.map((item, i) => (
            <AccordionItem key={item.q} value={item.q} className="border-b border-border first:border-t first:border-t-foreground/80">
              <AccordionTrigger className="items-center gap-6 rounded-none py-7 text-left hover:no-underline">
                <span className="flex items-baseline gap-5 md:gap-8">
                  <span className="text-xs tracking-[0.12em] text-signal-text">0{i + 1}</span>
                  <span className="display text-[clamp(1.25rem,1rem+0.8vw,1.75rem)] leading-tight tracking-[-0.03em]">
                    {item.q}
                  </span>
                </span>
              </AccordionTrigger>
              <AccordionContent className="max-w-[60ch] pb-7 pl-10 text-base leading-relaxed text-muted-foreground md:pl-14">
                {item.a}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
        </Reveal>
      </div>
    </section>
  );
}
