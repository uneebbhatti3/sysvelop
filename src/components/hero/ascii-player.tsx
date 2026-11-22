"use client";

import * as React from "react";
import { Pause, Play } from "lucide-react";
import { uiLabels } from "@/content/site";
import { renderFrame } from "./ascii-scene";

const FRAME_MS = 1000 / 15; // ASCII reads well at 15 fps, and it costs less
const START_DELAY_MS = 1500; // let the page finish loading first

/**
 * Animates the server-rendered rows inside it. It only runs while it is on screen, in a visible
 * tab, not paused and not under reduced motion, so on phones (where it's hidden) it never runs.
 */
export function AsciiPlayer({ children }: { children: React.ReactNode }) {
  const root = React.useRef<HTMLDivElement>(null);
  const time = React.useRef(0); // kept here, so pausing resumes where it stopped
  const [paused, setPaused] = React.useState(false);

  React.useEffect(() => {
    const element = root.current;
    if (!element || paused) return;
    // Change text nodes in place: no elements created, no React renders.
    const rows = [...element.querySelectorAll("[data-row]")].map((row) => row.firstChild as Text);
    const reduced = matchMedia("(prefers-reduced-motion: reduce)");
    let visible = false;
    let ready = time.current > 0;
    let frame = 0;
    let last = 0;

    const tick = (now: number) => {
      frame = requestAnimationFrame(tick);
      const elapsed = now - last;
      if (elapsed < FRAME_MS - 4) return; // the 4 ms absorbs display timing jitter
      last = now;
      time.current += Math.min(elapsed, 100) / 1000;

      let i = 0;
      for (const layer of renderFrame(time.current)) {
        for (const line of layer) {
          const node = rows[i++];
          if (node.data !== line) node.data = line;
        }
      }
    };

    const update = () => {
      cancelAnimationFrame(frame);
      if (!ready || !visible || reduced.matches) return;
      last = performance.now();
      frame = requestAnimationFrame(tick);
    };

    const observer = new IntersectionObserver((entries) => {
      visible = entries[entries.length - 1].isIntersecting;
      update();
    });
    observer.observe(element);
    reduced.addEventListener("change", update);
    const timer = setTimeout(() => {
      ready = true;
      update();
    }, START_DELAY_MS);

    return () => {
      cancelAnimationFrame(frame);
      clearTimeout(timer);
      observer.disconnect();
      reduced.removeEventListener("change", update);
    };
  }, [paused]);

  return (
    <div ref={root} className="relative mx-auto aspect-square w-full max-w-[520px]">
      {children}
      {/* WCAG 2.2.2: anything that moves for more than five seconds can be paused. */}
      <button
        type="button"
        aria-label={paused ? uiLabels.playAnimation : uiLabels.pauseAnimation}
        onClick={() => setPaused((p) => !p)}
        className="ascii-toggle absolute bottom-0 left-0 flex size-11 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-tint hover:text-signal-text motion-reduce:hidden"
      >
        {paused ? <Play className="size-4" aria-hidden="true" /> : <Pause className="size-4" aria-hidden="true" />}
      </button>
    </div>
  );
}
