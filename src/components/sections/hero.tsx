import { ArrowUpRight } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { hero } from "@/content/site";
import { hasWork } from "@/content/projects";
import { Eyebrow } from "@/components/shared/eyebrow";
import { BookingCard } from "@/components/shared/booking-card";
import { NodeLines } from "@/components/shared/node-lines";

export function Hero() {
  return (
    <section aria-labelledby="hero-heading" className="relative isolate overflow-hidden">
      <div aria-hidden="true" className="hero-ground absolute inset-0 -z-10" />
      <div
        aria-hidden="true"
        className="absolute inset-x-0 top-0 -z-10 h-px bg-[linear-gradient(90deg,transparent,rgb(122_147_255/0.5),transparent)]"
      />

      <div className="container-x flex flex-col items-center pt-16 pb-20 text-center sm:pt-24 md:pb-28">
        <Eyebrow>
          {hero.eyebrow.map((item, i) => (
            <span key={item} className="contents">
              {i > 0 ? <span aria-hidden="true" className="text-white/25">·</span> : null}
              {item}
            </span>
          ))}
        </Eyebrow>

        {/* LCP element: plain server-rendered text, never animated or gated. */}
        <h1
          id="hero-heading"
          className="mt-7 max-w-[17ch] text-[clamp(2.25rem,1.2rem+4.5vw,5.25rem)] leading-[1.02] font-[560] tracking-[-0.035em] text-balance"
        >
          {hero.headline}
        </h1>

        <p className="mt-6 max-w-[38rem] text-[17px] leading-relaxed text-pretty text-muted-foreground md:text-[19px]">
          {hero.subheading}
        </p>

        <div className="mt-9 flex w-full flex-col items-stretch gap-3 min-[440px]:w-auto min-[440px]:flex-row min-[440px]:items-center">
          <a href={hero.primary.href} className={buttonVariants({ size: "cta", className: "h-12 px-6" })}>
            {hero.primary.label}
            <ArrowUpRight className="size-4" aria-hidden="true" />
          </a>
          {hasWork ? (
            <a
              href={hero.secondary.href}
              className={buttonVariants({ variant: "outline", size: "cta", className: "h-12 px-6" })}
            >
              {hero.secondary.label}
            </a>
          ) : null}
        </div>

        <div data-scene className="relative mt-16 w-full md:mt-20 lg:h-[400px] lg:w-[1000px] lg:max-w-full">
          <div className="hidden lg:block">
            <NodeLines />
          </div>
          <div className="relative mx-auto w-full max-w-[400px] text-left lg:absolute lg:top-1/2 lg:left-1/2 lg:-translate-x-1/2 lg:-translate-y-1/2">
            <BookingCard />
          </div>
        </div>
      </div>
    </section>
  );
}
