"use client";

import { useRef, useState } from "react";
import { Pause, Play } from "lucide-react";
import { uiLabels } from "@/content/site";

// WCAG 2.2.2: the hero loop runs longer than 5 seconds, so it must be pausable.
// Toggles [data-paused] on the nearest [data-scene]; CSS pauses every animation inside.
export function MotionToggle() {
  const ref = useRef<HTMLButtonElement>(null);
  const [paused, setPaused] = useState(false);

  function toggle() {
    const next = !paused;
    ref.current?.closest("[data-scene]")?.toggleAttribute("data-paused", next);
    setPaused(next);
  }

  return (
    <button
      ref={ref}
      type="button"
      onClick={toggle}
      aria-label={paused ? uiLabels.playAnimation : uiLabels.pauseAnimation}
      className="-m-2 inline-flex size-11 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:text-foreground motion-reduce:hidden"
    >
      <span className="inline-flex size-7 items-center justify-center rounded-md border border-border bg-white/[0.03]">
        {paused ? <Play className="size-3.5" aria-hidden="true" /> : <Pause className="size-3.5" aria-hidden="true" />}
      </span>
    </button>
  );
}
