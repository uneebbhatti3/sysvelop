import { contactForm, cta, site } from "@/content/site";
import { ContactForm } from "@/components/shared/contact-form";
import { SplitText } from "@/components/shared/split-heading";
import { Reveal, Stagger, StaggerItem } from "@/components/motion/reveal";

// Ink band: dark tokens are scoped by .theme-ink so the form restyles itself.
export function Cta() {
  return (
    <section id="contact" aria-labelledby="cta-heading" className="theme-ink pt-24 pb-20 md:pt-40 md:pb-28">
      <div className="container-x">
        <Stagger stagger={0.12}>
          <StaggerItem as="p" variant="fade" className="label text-signal-text">
            {contactForm.heading}
          </StaggerItem>
          <StaggerItem
            as="h2"
            id="cta-heading"
            className="display mt-7 max-w-[14ch] text-[clamp(3rem,1.2rem+6.6vw,8rem)] text-balance"
          >
            <SplitText text={cta.heading} tail={3} />
          </StaggerItem>
        </Stagger>

        <div className="mt-16 grid gap-12 border-t border-border pt-12 md:mt-24 lg:grid-cols-12 lg:gap-8">
          <Reveal className="flex flex-col gap-5 lg:col-span-4">
            <p className="max-w-[34ch] text-lg leading-relaxed text-muted-foreground">{cta.text}</p>
            {site.contactEmail ? (
              <a href={`mailto:${site.contactEmail}`} className="text-lg font-medium text-foreground underline underline-offset-4">
                {site.contactEmail}
              </a>
            ) : null}
          </Reveal>
          <Reveal delay={0.12} className="lg:col-span-7 lg:col-start-6">
            <h3 className="sr-only">{contactForm.heading}</h3>
            <ContactForm />
          </Reveal>
        </div>
      </div>
    </section>
  );
}
