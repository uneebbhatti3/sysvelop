import { ArrowUpRight } from "lucide-react";
import { engagements } from "@/content/site";
import { buttonVariants } from "@/components/ui/button";
import { SectionHeader } from "@/components/shared/section-header";

export function Engagements() {
  return (
    <section id="engagements" aria-labelledby="engagements-heading" className="py-24 md:py-40">
      <div className="container-x">
        <SectionHeader id="engagements-heading" eyebrow={engagements.eyebrow} heading={engagements.heading} tail={2} />
        <ul className="mt-16 grid gap-4 md:mt-24 lg:grid-cols-3 lg:gap-5">
          {engagements.items.map((item, i) => (
            <li key={item.name} className="flex min-h-[20rem] flex-col rounded-[3px] border border-border bg-surface p-7 md:p-8">
              <span className="text-xs tracking-[0.12em] text-signal-text">0{i + 1}</span>
              <h3 className="display mt-auto pt-12 text-[clamp(2rem,1.6rem+1.2vw,2.75rem)] leading-[1] tracking-[-0.045em]">
                {item.name}
              </h3>
              <p className="mt-4 text-[15px] leading-relaxed text-muted-foreground">{item.text}</p>
              <p className="mt-6 border-t border-border pt-5 text-sm">
                <span className="text-muted-foreground">{engagements.bestForLabel}: </span>
                <span className="font-medium">{item.bestFor}</span>
              </p>
            </li>
          ))}
        </ul>
        <a href={engagements.cta.href} className={buttonVariants({ size: "pill", className: "mt-12" })}>
          {engagements.cta.label}
          <ArrowUpRight className="size-4 text-[#9db1ff]" aria-hidden="true" />
        </a>
      </div>
    </section>
  );
}
