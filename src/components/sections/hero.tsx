import { ArrowDown, ArrowUpRight } from "lucide-react";
import { buttonVariants } from "@/components/ui/button-variants";
import { hero } from "@/content/site";
import { getHasWork } from "@/content/projects";
import { SplitText } from "@/components/shared/split-heading";
import { HeroAscii } from "@/components/hero/hero-ascii";

const delay = (ms: number) => ({ "--d": `${ms}ms` }) as React.CSSProperties;

export async function Hero() {
  const secondary = (await getHasWork()) ? hero.secondary : hero.secondaryAlt;

  return (
    <section aria-labelledby="hero-heading" className="relative overflow-hidden">
      <div className="container-x pt-14 md:pt-24">
        <div className="grid items-center gap-12 lg:grid-cols-12 lg:gap-6">
          <div className="lg:col-span-7">
            <p className="rise label text-signal-text">{hero.eyebrow.join(" / ")}</p>

            {/* LCP element: plain server-rendered text. Never animated. */}
            <h1
              id="hero-heading"
              className="display mt-7 max-w-[13ch] text-[clamp(3rem,1.1rem+6.8vw,7.5rem)] text-balance"
            >
              <SplitText text={hero.headline} tail={2} />
            </h1>

            <p style={delay(120)} className="rise mt-9 max-w-[34rem] text-[17px] leading-[1.65] text-pretty text-muted-foreground md:text-[19px]">
              {hero.subheading}
            </p>

            <div style={delay(220)} className="rise mt-10 flex flex-col gap-3 min-[440px]:flex-row">
              <a href={hero.primary.href} className={buttonVariants({ size: "pill" })}>
                {hero.primary.label}
                <ArrowUpRight className="size-4 text-[#9db1ff] nudge" aria-hidden="true" />
              </a>
              <a href={secondary.href} className={buttonVariants({ variant: "outline", size: "pill" })}>
                {secondary.label}
                <ArrowDown className="size-4 text-signal-text nudge-down" aria-hidden="true" />
              </a>
            </div>
          </div>

          <div className="hidden md:block lg:col-span-5">
            <HeroAscii />
          </div>
        </div>

        <div style={delay(380)} className="rise mt-16 flex flex-col gap-3 border-t border-border py-6 sm:flex-row sm:items-center sm:justify-between md:mt-24">
          <p className="label max-w-[60ch] leading-relaxed text-muted-foreground">{hero.regions}</p>
          <p className="flex items-center gap-3 text-sm text-muted-foreground">
            <span aria-hidden="true" className="h-px w-9 bg-foreground/60" />
            {hero.scrollCue}
          </p>
        </div>
      </div>
    </section>
  );
}
