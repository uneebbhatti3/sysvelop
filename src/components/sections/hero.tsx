import { ArrowDown, ArrowUpRight } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { hero } from "@/content/site";
import { hasWork } from "@/content/projects";
import { SplitText } from "@/components/shared/split-heading";
import { Stagger, StaggerItem } from "@/components/motion/reveal";

const delay = (ms: number) => ({ "--d": `${ms}ms` }) as React.CSSProperties;

export function Hero() {
  const secondary = hasWork ? hero.secondary : hero.secondaryAlt;

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
            <Orbit />
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

// Code-built orbit: two rings, travelling dots, a blue core, and three static labels.
// Decorative only; rotation is disabled under prefers-reduced-motion.
function Orbit() {
  const [a, b, c] = hero.orbitLabels;
  return (
    <Stagger onLoad delay={0.15} stagger={0.12} aria-hidden className="relative mx-auto aspect-square w-full max-w-[520px]">
      <StaggerItem variant="scaleIn" className="absolute inset-0">
        {/* outer ring with travelling dots */}
        <div className="orbit-spin absolute inset-0 rounded-full border border-signal/25">
          <span className="absolute top-[14%] left-[14%] size-3 -translate-1/2 rounded-full bg-signal shadow-[0_0_0_6px_rgb(0_60_255/0.12)]" />
          <span className="absolute right-[6%] bottom-[24%] size-2.5 translate-1/2 rounded-full bg-foreground shadow-[0_0_0_6px_rgb(27_27_27/0.08)]" />
        </div>
        {/* inner ring */}
        <div className="orbit-spin-rev absolute inset-[15%] rounded-full border border-foreground/15">
          <span className="absolute top-1/2 -left-1 size-2 rounded-full bg-signal/60" />
        </div>
        {/* core */}
        <div className="absolute inset-[30%] rounded-full bg-[radial-gradient(circle_at_34%_30%,#8aa2ff_0%,#003cff_48%,#00135c_100%)] shadow-[0_30px_80px_-20px_rgb(0_60_255/0.55)]">
          <div className="absolute inset-[18%] rounded-full border border-white/20" />
          <div className="absolute inset-[38%] rounded-full border border-white/25" />
        </div>
      </StaggerItem>
      {/* labels */}
      <Pill className="top-[12%] right-[-2%]">{a}</Pill>
      <Pill className="top-[46%] left-[-6%]">{b}</Pill>
      <Pill className="right-[14%] bottom-[6%]">{c}</Pill>
    </Stagger>
  );
}

function Pill({ className, children }: { className: string; children: React.ReactNode }) {
  return (
    <StaggerItem
      as="span"
      variant="pop"
      className={`label absolute rounded-full border border-border bg-background px-3.5 py-2 text-[11px] text-foreground shadow-[0_8px_24px_-12px_rgb(27_27_27/0.25)] ${className}`}
    >
      {children}
    </StaggerItem>
  );
}
