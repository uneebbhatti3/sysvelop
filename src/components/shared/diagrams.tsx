import { BellRing, Check, Inbox, MessageSquare, Search, TrendingUp, Workflow, CalendarClock, Zap } from "lucide-react";

// Static, code-built mini diagrams for the "Why one system" bento (DESIGN §7).
// No numbers or names: nothing here may read as a claim or invented data.

const skeleton = "rounded-full bg-white/[0.08]";

/** Speed: a page that has finished loading, with a complete load bar. */
export function SpeedDiagram() {
  return (
    <div className="relative mx-auto flex h-full w-full max-w-[460px] items-center">
      <div className="w-full overflow-hidden rounded-xl border border-border bg-background/60">
        <div className="flex items-center gap-1.5 border-b border-border px-3 py-2.5">
          <span className="size-2 rounded-full bg-white/15" />
          <span className="size-2 rounded-full bg-white/15" />
          <span className="size-2 rounded-full bg-white/15" />
          <span className={`ml-3 h-2 w-32 ${skeleton}`} />
        </div>
        <div className="h-[2px] w-full bg-[linear-gradient(90deg,var(--signal),var(--highlight))] shadow-[0_0_12px_var(--signal)]" />
        <div className="flex flex-col gap-3 p-4">
          <span className={`h-3 w-2/3 ${skeleton} bg-white/[0.14]`} />
          <span className={`h-2 w-1/2 ${skeleton}`} />
          <div className="mt-1 grid grid-cols-3 gap-2">
            {[0, 1, 2].map((i) => (
              <div key={i} className="flex h-14 flex-col justify-end gap-1.5 rounded-lg border border-border bg-white/[0.02] p-2">
                <span className={`h-1.5 w-3/4 ${skeleton}`} />
                <span className={`h-1.5 w-1/2 ${skeleton}`} />
              </div>
            ))}
          </div>
        </div>
      </div>
      <div className="absolute -top-3 -right-1 flex size-12 items-center justify-center rounded-xl border border-signal/60 bg-[#0d1330] shadow-[0_0_30px_-4px_var(--signal)] sm:-right-4">
        <Zap className="size-5 text-signal-text" strokeWidth={1.75} aria-hidden="true" />
      </div>
    </div>
  );
}

/** Booking: a calendar month with one confirmed day. */
export function BookingDiagram() {
  const cells = Array.from({ length: 28 }, (_, i) => i);
  const picked = 17;
  const busy = new Set([3, 9, 12, 22, 25]);
  return (
    <div className="relative mx-auto flex h-full w-full max-w-[300px] items-center">
      <div className="w-full rounded-xl border border-border bg-background/60 p-4">
        <div className="mb-3 flex items-center justify-between">
          <span className={`h-2 w-20 ${skeleton} bg-white/[0.14]`} />
          <span className={`h-2 w-8 ${skeleton}`} />
        </div>
        <div className="grid grid-cols-7 gap-1.5">
          {cells.map((i) =>
            i === picked ? (
              <span
                key={i}
                className="flex aspect-square items-center justify-center rounded-md bg-signal shadow-[0_0_16px_-2px_var(--signal)]"
              >
                <Check className="size-3 text-white" strokeWidth={3} aria-hidden="true" />
              </span>
            ) : (
              <span
                key={i}
                className={`aspect-square rounded-md border border-border ${busy.has(i) ? "bg-white/[0.07]" : "bg-white/[0.015]"}`}
              />
            ),
          )}
        </div>
      </div>
      <div className="absolute -right-2 -bottom-3 flex items-center gap-2 rounded-lg border border-border-strong bg-surface-raised px-3 py-2 shadow-lg sm:-right-6">
        <span className="flex size-5 items-center justify-center rounded-full bg-highlight/15 ring-1 ring-highlight/40">
          <Check className="size-3 text-highlight" strokeWidth={3} aria-hidden="true" />
        </span>
        <span className={`h-1.5 w-14 ${skeleton} bg-white/[0.14]`} />
      </div>
    </div>
  );
}

/** Automation: one input, a workflow hub, three outputs. */
export function AutomationDiagram() {
  const outs = [
    { y: 50, Icon: BellRing },
    { y: 120, Icon: MessageSquare },
    { y: 190, Icon: CalendarClock },
  ];
  return (
    <svg viewBox="0 0 360 240" className="mx-auto h-full max-h-[240px] w-full max-w-[400px]" fill="none" aria-hidden="true" focusable="false">
      <path d="M78 120 H 152" stroke="rgb(255 255 255 / 0.18)" />
      {outs.map(({ y }) => (
        <path key={y} d={`M208 120 C 250 120, 250 ${y}, 290 ${y}`} stroke="rgb(255 255 255 / 0.18)" />
      ))}
      <circle cx="115" cy="120" r="2.5" fill="#7a93ff" />
      <circle cx="248" cy="120" r="2.5" fill="#3dd6f5" fillOpacity="0.8" />

      <rect x="30" y="96" width="48" height="48" rx="12" fill="#0b0d16" stroke="rgb(255 255 255 / 0.14)" />
      <Inbox x={43} y={109} width={22} height={22} strokeWidth={1.5} color="#9aa0b4" />

      <circle cx="180" cy="120" r="44" fill="url(#hub-glow)" />
      <rect x="152" y="92" width="56" height="56" rx="14" fill="#0d1330" stroke="#1f4bff" />
      <Workflow x={167} y={107} width={26} height={26} strokeWidth={1.5} color="#7a93ff" />

      {outs.map(({ y, Icon }) => (
        <g key={`t-${y}`}>
          <rect x="290" y={y - 20} width="40" height="40" rx="10" fill="#0b0d16" stroke="rgb(255 255 255 / 0.14)" />
          <Icon x={300} y={y - 10} width={20} height={20} strokeWidth={1.5} color="#9aa0b4" />
        </g>
      ))}
      <defs>
        <radialGradient id="hub-glow">
          <stop offset="0" stopColor="#1f4bff" stopOpacity="0.35" />
          <stop offset="1" stopColor="#1f4bff" stopOpacity="0" />
        </radialGradient>
      </defs>
    </svg>
  );
}

/** Findable: a search with the first result lit. */
export function FindableDiagram() {
  return (
    <div className="mx-auto flex h-full w-full max-w-[460px] flex-col justify-center gap-2.5">
      <div className="flex h-11 items-center gap-3 rounded-full border border-border-strong bg-background/60 px-4">
        <Search className="size-4 text-muted-foreground" aria-hidden="true" />
        <span className={`h-2 w-40 ${skeleton} bg-white/[0.14]`} />
      </div>
      {[0, 1, 2].map((i) => (
        <div
          key={i}
          className={
            i === 0
              ? "flex items-center gap-3 rounded-xl border border-signal/60 bg-[linear-gradient(90deg,rgb(31_75_255/0.18),transparent)] p-3 shadow-[0_0_30px_-12px_var(--signal)]"
              : "flex items-center gap-3 rounded-xl border border-border bg-white/[0.015] p-3 opacity-70"
          }
        >
          <span className={`size-7 shrink-0 rounded-md ${i === 0 ? "bg-signal/30 ring-1 ring-signal/60" : "bg-white/[0.06]"}`} />
          <div className="flex flex-1 flex-col gap-1.5">
            <span className={`h-2 w-3/5 ${skeleton} ${i === 0 ? "bg-white/[0.22]" : ""}`} />
            <span className={`h-1.5 w-4/5 ${skeleton}`} />
          </div>
          {i === 0 ? <TrendingUp className="size-4 text-highlight" aria-hidden="true" /> : null}
        </div>
      ))}
    </div>
  );
}
