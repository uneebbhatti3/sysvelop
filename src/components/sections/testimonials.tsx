import { testimonialsSection } from "@/content/testimonials";
import { readTestimonials } from "@/lib/testimonials";
import { SectionHeader } from "@/components/shared/section-header";
import { Stagger, StaggerItem } from "@/components/motion/reveal";
import { cn } from "@/lib/utils";

// Real testimonials the owner has published. Hidden while there are none.
export async function Testimonials() {
  const items = await readTestimonials();
  if (items.length === 0) return null;

  return (
    <section id="testimonials" aria-labelledby="testimonials-heading" className="border-t border-border py-24 md:py-40">
      <div className="container-x">
        <SectionHeader id="testimonials-heading" eyebrow={testimonialsSection.eyebrow} heading={testimonialsSection.heading} tail={2} />
        <Stagger as="ul" className={cn("mt-16 grid gap-4 md:mt-24 lg:gap-5", items.length > 1 && "md:grid-cols-2")}>
          {items.map((t) => (
            <StaggerItem as="li" key={t.id} className="min-w-0 rounded-[3px] border border-border bg-surface p-7 md:p-9">
              <figure className="flex h-full flex-col gap-8">
                <blockquote
                  className={cn(
                    "break-words whitespace-pre-line",
                    t.quote.length <= 220
                      ? "display text-[clamp(1.5rem,1.2rem+1vw,2.1rem)] leading-[1.12] tracking-[-0.03em]"
                      : "text-[17px] leading-relaxed",
                  )}
                >
                  {t.quote}
                </blockquote>
                <figcaption className="mt-auto border-t border-border pt-5 text-sm break-words">
                  <span className="block font-medium">{t.name}</span>
                  {t.role || t.company ? (
                    <span className="mt-1 block text-muted-foreground">{[t.role, t.company].filter(Boolean).join(", ")}</span>
                  ) : null}
                </figcaption>
              </figure>
            </StaggerItem>
          ))}
        </Stagger>
      </div>
    </section>
  );
}
