import { cn } from "@/lib/utils";
import { SplitText } from "./split-heading";

// Editorial header: accent label, oversized display heading (last words dimmed), intro on the right.
export function SectionHeader({
  id,
  eyebrow,
  heading,
  tail = 0,
  intro,
  stacked = false,
  className,
}: {
  id: string;
  eyebrow: string;
  heading: string;
  /** Number of trailing words shown in the dim colour. */
  tail?: number;
  intro?: string;
  /** Narrow column use: smaller heading, intro below. */
  stacked?: boolean;
  className?: string;
}) {
  return (
    <div className={cn("flex flex-col gap-6", className)}>
      <p className="label text-signal-text">{eyebrow}</p>
      <div className={cn("grid gap-8", !stacked && "lg:grid-cols-12 lg:items-start")}>
        <h2
          id={id}
          className={cn(
            "display text-balance",
            stacked
              ? "text-[clamp(2.5rem,1.6rem+3vw,4.25rem)]"
              : "max-w-[16ch] text-[clamp(2.75rem,1.4rem+5.2vw,7rem)] lg:col-span-8",
          )}
        >
          <SplitText text={heading} tail={tail} />
        </h2>
        {intro ? (
          <p
            className={cn(
              "max-w-[40ch] text-[17px] leading-[1.65] text-pretty text-muted-foreground md:text-lg",
              !stacked && "lg:col-span-4 lg:col-start-9 lg:pt-4",
            )}
          >
            {intro}
          </p>
        ) : null}
      </div>
    </div>
  );
}
