import { industries } from "@/content/site";
import { SectionHeader } from "@/components/shared/section-header";

// Light-blue band. Muted text is darkened locally to keep 4.5:1 on the band colour.
export function Industries() {
  return (
    <section
      id="industries"
      aria-labelledby="industries-heading"
      className="bg-band py-24 [--muted-foreground:#3f4250] [--dim:#5d6072] md:py-40"
    >
      <div className="container-x grid gap-16 lg:grid-cols-12 lg:gap-8">
        <SectionHeader
          id="industries-heading"
          eyebrow={industries.eyebrow}
          heading={industries.heading}
          tail={3}
          stacked
          className="lg:sticky lg:top-28 lg:col-span-5 lg:self-start"
        />
        <ol className="relative lg:col-span-6 lg:col-start-7">
          <span aria-hidden="true" className="absolute top-4 bottom-4 left-[15px] w-px bg-foreground/20" />
          {industries.items.map((item, i) => (
            <li key={item.name} className="relative grid grid-cols-[2rem_1fr] gap-x-6 py-7 md:py-9">
              <span
                aria-hidden="true"
                className={
                  i === 0
                    ? "mt-1 flex size-8 items-center justify-center rounded-full bg-signal shadow-[0_0_0_8px_rgb(0_60_255/0.15)]"
                    : "mt-1 flex size-8 items-center justify-center rounded-full border border-foreground/25 bg-band"
                }
              >
                <span className={i === 0 ? "size-2 rounded-full bg-white" : "size-1.5 rounded-full bg-foreground/40"} />
              </span>
              <div className="grid gap-3 md:grid-cols-2 md:gap-8">
                <h3 className="display text-[clamp(2rem,1.5rem+1.6vw,2.75rem)] leading-[1] tracking-[-0.045em]">
                  {item.name}
                </h3>
                <p className="text-[15px] leading-relaxed text-muted-foreground md:pt-1">{item.text}</p>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
