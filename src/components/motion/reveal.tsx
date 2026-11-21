"use client";

import { LazyMotion, MotionConfig, domAnimation, m, type Variants } from "motion/react";

// Motion primitives. Rules (docs/DESIGN.md §8): transform + opacity only, 400-600ms ease-out,
// light stagger, once on entering the viewport. `reducedMotion="user"` drops transforms for
// people who ask for less motion, so only a soft fade remains. LazyMotion + domAnimation keeps
// the runtime small; `strict` stops a full `motion.*` import from slipping in.

const ease = [0.22, 1, 0.36, 1] as const;

export const variants = {
  fadeUp: {
    hidden: { opacity: 0, y: 12 },
    show: { opacity: 1, y: 0, transition: { duration: 0.6, ease } },
  },
  fade: {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { duration: 0.6, ease } },
  },
  scaleIn: {
    hidden: { opacity: 0, scale: 0.94 },
    show: { opacity: 1, scale: 1, transition: { duration: 0.9, ease } },
  },
  pop: {
    hidden: { opacity: 0, y: 8, scale: 0.96 },
    show: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.5, ease } },
  },
  rise: {
    hidden: { opacity: 0, y: 40 },
    show: { opacity: 1, y: 0, transition: { duration: 1, ease } },
  },
  drawY: {
    hidden: { scaleY: 0 },
    show: { scaleY: 1, transition: { duration: 1.4, ease } },
  },
} satisfies Record<string, Variants>;

type VariantName = keyof typeof variants;

const tags = {
  div: m.div,
  span: m.span,
  p: m.p,
  h2: m.h2,
  ul: m.ul,
  ol: m.ol,
  li: m.li,
  dl: m.dl,
} as const;

type Tag = keyof typeof tags;

type BaseProps = {
  as?: Tag;
  className?: string;
  children?: React.ReactNode;
  id?: string;
  "aria-hidden"?: boolean;
};

// Trigger a little after the element enters, so the movement is actually seen.
const viewport = { once: true, margin: "0px 0px -12% 0px" } as const;

export function MotionProvider({ children }: { children: React.ReactNode }) {
  return (
    <LazyMotion features={domAnimation} strict>
      <MotionConfig reducedMotion="user">{children}</MotionConfig>
    </LazyMotion>
  );
}

/** A single element that fades in once it scrolls into view. */
export function Reveal({
  as = "div",
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
  const Comp = tags[as];
  const v = variants[variant];
  return (
    <Comp
      data-reveal=""
      initial="hidden"
      {...(onLoad ? { animate: "show" } : { whileInView: "show", viewport })}
      variants={{ hidden: v.hidden, show: { ...v.show, transition: { ...v.show.transition, delay } } }}
      {...props}
    />
  );
}

/** A container whose `StaggerItem` children reveal one after another. */
export function Stagger({
  as = "div",
  stagger = 0.08,
  delay = 0,
  onLoad = false,
  ...props
}: BaseProps & { stagger?: number; delay?: number; onLoad?: boolean }) {
  const Comp = tags[as];
  return (
    <Comp
      initial="hidden"
      {...(onLoad ? { animate: "show" } : { whileInView: "show", viewport })}
      variants={{ hidden: {}, show: { transition: { staggerChildren: stagger, delayChildren: delay } } }}
      {...props}
    />
  );
}

/** Child of `Stagger`. `lift` adds a small hover raise for cards. */
export function StaggerItem({
  as = "div",
  variant = "fadeUp",
  lift = false,
  ...props
}: BaseProps & { variant?: VariantName; lift?: boolean }) {
  const Comp = tags[as];
  return (
    <Comp
      data-reveal=""
      variants={variants[variant]}
      {...(lift ? { whileHover: { y: -6, transition: { duration: 0.3, ease } } } : {})}
      {...props}
    />
  );
}
