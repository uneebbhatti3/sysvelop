import { cn } from "@/lib/utils";
import { uiLabels } from "@/content/site";

// TODO(owner): temporary live-text wordmark. The supplied logo (public/logo.png) is a
// 101x23 PNG with near-black letters that disappear on the dark theme. Replace with
// the official SVG (light version) when supplied. The blue "v" echoes the logo.
export function Logo({ className, href = "#top" }: { className?: string; href?: string }) {
  return (
    <a
      href={href}
      aria-label={uiLabels.homeLink}
      className={cn(
        "inline-flex h-11 items-center rounded-md text-[22px] leading-none font-semibold tracking-[-0.04em] text-foreground",
        className,
      )}
    >
      <span aria-hidden="true">
        sys<span className="text-signal-text">v</span>elop
      </span>
    </a>
  );
}
