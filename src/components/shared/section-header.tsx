import { cn } from "@/lib/utils";
import { Eyebrow } from "./eyebrow";

export function SectionHeader({
  id,
  eyebrow,
  heading,
  intro,
  align = "center",
  className,
}: {
  id: string;
  eyebrow: string;
  heading: string;
  intro?: string;
  align?: "center" | "left";
  className?: string;
}) {
  return (
    <div
      className={cn(
        "flex flex-col gap-5",
        align === "center" ? "mx-auto max-w-3xl items-center text-center" : "items-start",
        className,
      )}
    >
      <Eyebrow>{eyebrow}</Eyebrow>
      <h2
        id={id}
        className="text-[clamp(1.875rem,1.3rem+2.2vw,3rem)] leading-[1.1] font-[560] tracking-[-0.02em] text-balance"
      >
        {heading}
      </h2>
      {intro ? (
        <p className="max-w-[60ch] text-[17px] leading-relaxed text-pretty text-muted-foreground md:text-lg">
          {intro}
        </p>
      ) : null}
    </div>
  );
}
