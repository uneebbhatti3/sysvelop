import { cn } from "@/lib/utils";
import { uiLabels } from "@/content/site";

// TODO(owner): temporary live-text wordmark. Replace with the official SVG logo when
// supplied (public/logo.png is only 101x23). The blue "v" echoes the logo.
export function Logo({ className, href = "/" }: { className?: string; href?: string }) {
  return (
    <a
      href={href}
      aria-label={uiLabels.homeLink}
      className={cn(
        "inline-flex h-11 items-center rounded-md font-display text-[24px] leading-none font-medium tracking-[-0.05em] text-foreground",
        className,
      )}
    >
      <span aria-hidden="true">
        sys<span className="text-signal-text">v</span>elop
      </span>
    </a>
  );
}
