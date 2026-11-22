// Motion primitives. Rules (docs/DESIGN.md §8): transform + opacity only, 400-600ms ease-out,
// light stagger, once on entering the viewport.
// These are plain server-rendered elements, so they cost no JavaScript. Start states are in
// globals.css and <RevealObserver> plays them.

export type VariantName = "fadeUp" | "fade" | "scaleIn" | "pop" | "rise" | "drawY";
type Tag = "div" | "span" | "p" | "h2" | "ul" | "ol" | "li" | "dl";

type BaseProps = {
  as?: Tag;
  className?: string;
  children?: React.ReactNode;
  id?: string;
  "aria-hidden"?: boolean;
};

/** A single element that fades in once it scrolls into view. */
export function Reveal({
  as: Comp = "div",
  variant = "fadeUp",
  delay = 0,
  onLoad = false,
  ...props
}: BaseProps & {
  variant?: VariantName;
  delay?: number;
  /** Animate on mount instead of on scroll (above-the-fold decoration). */
  onLoad?: boolean;
}) {
  return (
    <Comp
      data-reveal={variant}
      data-reveal-root=""
      data-delay={delay || undefined}
      data-on-load={onLoad ? "" : undefined}
      {...props}
    />
  );
}

/** A container whose `StaggerItem` children reveal one after another. */
export function Stagger({
  as: Comp = "div",
  stagger = 0.08,
  delay = 0,
  onLoad = false,
  ...props
}: BaseProps & { stagger?: number; delay?: number; onLoad?: boolean }) {
  return (
    <Comp
      data-reveal-root=""
      data-stagger={stagger}
      data-delay={delay || undefined}
      data-on-load={onLoad ? "" : undefined}
      {...props}
    />
  );
}

/** Child of `Stagger`. `lift` adds a small hover raise for cards. */
export function StaggerItem({
  as: Comp = "div",
  variant = "fadeUp",
  lift = false,
  ...props
}: BaseProps & { variant?: VariantName; lift?: boolean }) {
  return <Comp data-reveal={variant} data-lift={lift ? "" : undefined} {...props} />;
}
