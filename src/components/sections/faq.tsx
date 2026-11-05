import { faq } from "@/content/faq";
import { SectionHeader } from "@/components/shared/section-header";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

export function Faq() {
  return (
    <section id="faq" aria-labelledby="faq-heading" className="border-t border-border py-24 md:py-32">
      <div className="container-x grid gap-10 lg:grid-cols-12 lg:gap-16">
        <SectionHeader
          id="faq-heading"
          eyebrow={faq.eyebrow}
          heading={faq.heading}
          align="left"
          className="lg:col-span-4"
        />
        <Accordion className="lg:col-span-8">
          {faq.items.map((item) => (
            <AccordionItem key={item.q} value={item.q} className="border-b border-border first:border-t">
              <AccordionTrigger className="items-center rounded-none py-6 text-[17px] font-medium hover:no-underline md:text-lg">
                {item.q}
              </AccordionTrigger>
              <AccordionContent className="max-w-[62ch] pb-6 text-base leading-relaxed text-muted-foreground">
                {item.a}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  );
}
