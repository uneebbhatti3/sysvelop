"use client";

import { useEffect } from "react";
import type { VariantName } from "./reveal";

// Keep the start states in step with the [data-reveal] rules in globals.css.
const motion: Record<VariantName, { from: string; ms: number }> = {
  fadeUp: { from: "translateY(12px)", ms: 600 },
  fade: { from: "none", ms: 600 },
  scaleIn: { from: "scale(0.94)", ms: 900 },
  pop: { from: "translateY(8px) scale(0.96)", ms: 500 },
  rise: { from: "translateY(40px)", ms: 1000 },
  drawY: { from: "scaleY(0)", ms: 1400 },
};

function play(root: HTMLElement) {
  const still = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const items = root.dataset.reveal ? [root] : [...root.querySelectorAll<HTMLElement>("[data-reveal]:not([data-reveal-root])")];
  const step = Number(root.dataset.stagger ?? 0);
  const delay = Number(root.dataset.delay ?? 0);

  items.forEach((el, i) => {
    const { from, ms } = motion[el.dataset.reveal as VariantName];
    // Web Animations rather than a class: it doesn't touch attributes React owns.
    el.animate(
      still ? [{ opacity: 0 }, { opacity: 1 }] : [{ opacity: 0, transform: from }, { opacity: 1, transform: "none" }],
      { duration: ms, delay: (delay + i * step) * 1000, easing: "cubic-bezier(0.22, 1, 0.36, 1)", fill: "both" },
    );
  });
}

/** One observer for every reveal on the page, including those added by navigation. */
export function RevealObserver() {
  useEffect(() => {
    const seen = new WeakSet<Element>();
    const onEnter = (entries: IntersectionObserverEntry[], observer: IntersectionObserver) => {
      for (const { target, isIntersecting } of entries) {
        if (!isIntersecting) continue;
        observer.unobserve(target);
        seen.add(target);
        play(target as HTMLElement);
      }
    };
    // Trigger a little after the element enters, so the movement is actually seen. The footer
    // wordmark can't get that far up the screen, so it triggers as soon as it enters.
    const inset = new IntersectionObserver(onEnter, { rootMargin: "0px 0px -12% 0px" });
    const edge = new IntersectionObserver(onEnter);

    const scan = () =>
      document.querySelectorAll<HTMLElement>("[data-reveal-root]").forEach((root) => {
        if (seen.has(root)) return;
        (root.dataset.reveal === "rise" || root.dataset.onLoad !== undefined ? edge : inset).observe(root);
      });

    scan();
    let frame = 0;
    const added = new MutationObserver(() => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(scan);
    });
    added.observe(document.body, { childList: true, subtree: true });

    return () => {
      cancelAnimationFrame(frame);
      added.disconnect();
      inset.disconnect();
      edge.disconnect();
    };
  }, []);

  return null;
}
