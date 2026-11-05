import { cn } from "@/lib/utils";

export function Eyebrow({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <p
      className={cn(
        "inline-flex items-center gap-2 rounded-full border border-border bg-white/[0.03] px-3 py-1.5 font-mono text-[12px] leading-none font-medium tracking-[0.06em] text-muted-foreground uppercase",
        className,
      )}
    >
      <span aria-hidden="true" className="size-1.5 rounded-full bg-signal-text shadow-[0_0_10px_var(--signal)]" />
      {children}
    </p>
  );
}
