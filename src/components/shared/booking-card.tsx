import { Bell, CalendarDays, Check, MousePointer2 } from "lucide-react";
import { hero } from "@/content/site";
import { cn } from "@/lib/utils";
import { MotionToggle } from "./motion-toggle";

// Code-built booking flow (DESIGN §4). Illustrative only: generic labels, no customer data.
// Every state is always in the DOM with reserved space; only opacity/transform animate
// (classes bk-* in globals.css). Default styles are the final, confirmed state.
export function BookingCard({ className }: { className?: string }) {
  const { label, slots, selectedIndex, confirmed, followUp } = hero.booking;

  return (
    <div
      className={cn(
        "relative rounded-[22px] bg-[linear-gradient(180deg,rgb(122_147_255/0.55),rgb(255_255_255/0.07)_38%,rgb(255_255_255/0.04))] p-px shadow-[0_40px_100px_-30px_rgb(31_75_255/0.55)]",
        className,
      )}
    >
      <div className="rounded-[21px] bg-[linear-gradient(180deg,#0f1324,#0a0c15_55%)]">
        <div className="flex items-center justify-between border-b border-border px-5 py-3.5">
          <p className="flex items-center gap-2 font-mono text-[12px] font-medium tracking-[0.08em] text-muted-foreground uppercase">
            <CalendarDays className="size-4 text-signal-text" aria-hidden="true" />
            {label}
          </p>
          <div className="flex items-center gap-3">
            <span aria-hidden="true" className="size-1.5 rounded-full bg-highlight shadow-[0_0_8px_var(--highlight)]" />
            <MotionToggle />
          </div>
        </div>

        <ul className="flex flex-col gap-2 p-4 sm:p-5">
          {slots.map((slot, i) => {
            const selected = i === selectedIndex;
            return (
              <li
                key={slot}
                className="relative flex h-12 items-center justify-between rounded-xl border border-border bg-white/[0.02] px-4 font-mono text-sm text-foreground/85"
              >
                {selected ? (
                  <span
                    aria-hidden="true"
                    className="bk-select absolute inset-0 rounded-xl border border-signal bg-[linear-gradient(90deg,rgb(31_75_255/0.28),rgb(31_75_255/0.12))] shadow-[0_0_24px_-6px_var(--signal)]"
                  />
                ) : null}
                <span className="relative">{slot}</span>
                <span className="relative flex size-5 items-center justify-center rounded-full border border-border-strong">
                  {selected ? (
                    <span className="bk-select flex size-5 items-center justify-center rounded-full bg-signal">
                      <Check className="size-3 text-white" strokeWidth={3} aria-hidden="true" />
                    </span>
                  ) : null}
                </span>
                {selected ? (
                  <MousePointer2
                    aria-hidden="true"
                    className="bk-cursor absolute top-1/2 right-9 size-4 fill-white text-white drop-shadow"
                  />
                ) : null}
              </li>
            );
          })}
        </ul>

        <div className="flex flex-col gap-2.5 border-t border-border px-5 py-4">
          <p className="bk-confirm flex items-center justify-between gap-3 text-sm">
            <span className="flex items-center gap-3 font-medium">
              <span className="flex size-6 items-center justify-center rounded-full bg-highlight/15 ring-1 ring-highlight/40">
                <Check className="size-3.5 text-highlight" strokeWidth={3} aria-hidden="true" />
              </span>
              {confirmed}
            </span>
            <span className="font-mono text-[13px] text-muted-foreground">{slots[selectedIndex]}</span>
          </p>
          <p className="bk-reminder flex items-center gap-3 text-sm text-muted-foreground">
            <span className="flex size-6 items-center justify-center rounded-full bg-white/[0.04] ring-1 ring-border">
              <Bell className="size-3.5" aria-hidden="true" />
            </span>
            {followUp}
          </p>
        </div>
      </div>
    </div>
  );
}
