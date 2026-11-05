import { contactForm, cta } from "@/content/site";
import { ContactForm } from "@/components/shared/contact-form";

export function Cta() {
  return (
    <section id="contact" aria-labelledby="cta-heading" className="py-24 md:py-32">
      <div className="container-x">
        <div className="relative isolate overflow-hidden rounded-[28px] border border-border-strong bg-[linear-gradient(140deg,#0f1a4d_0%,#0b0f24_45%,#0a0c15_100%)] shadow-[inset_0_1px_0_rgb(255_255_255/0.08)]">
          <div
            aria-hidden="true"
            className="absolute inset-0 -z-10 bg-[radial-gradient(60%_80%_at_0%_0%,rgb(31_75_255/0.55),transparent_60%),radial-gradient(40%_50%_at_100%_100%,rgb(61_214_245/0.10),transparent_70%)]"
          />
          <div
            aria-hidden="true"
            className="absolute inset-0 -z-10 opacity-60 [background:repeating-linear-gradient(90deg,transparent_0_44px,rgb(120_150_255/0.05)_44px_46px)] [mask-image:linear-gradient(90deg,#000,transparent_55%)]"
          />

          <div className="grid gap-12 p-7 sm:p-10 lg:grid-cols-12 lg:gap-16 lg:p-14">
            <div className="flex flex-col justify-center gap-5 lg:col-span-5">
              <h2
                id="cta-heading"
                className="text-[clamp(2rem,1.3rem+2.6vw,3.25rem)] leading-[1.05] font-[560] tracking-[-0.03em] text-balance"
              >
                {cta.heading}
              </h2>
              <p className="max-w-[40ch] text-lg leading-relaxed text-[#c3c8d8]">{cta.text}</p>
            </div>

            <div className="rounded-2xl border border-border-strong bg-background/75 p-6 sm:p-8 lg:col-span-7">
              <h3 className="mb-6 text-xl font-[560] tracking-[-0.01em]">{contactForm.heading}</h3>
              <ContactForm />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
