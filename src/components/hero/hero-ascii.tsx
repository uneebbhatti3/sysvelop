import { hero } from "@/content/site";
import { Stagger, StaggerItem } from "@/components/motion/reveal";
import { AsciiPlayer } from "./ascii-player";
import { LAYERS, renderFrame } from "./ascii-scene";

const colour: Record<(typeof LAYERS)[number], string> = {
  orbit: "text-foreground/40",
  signal: "text-foreground",
  side: "text-[#00135c]",
  face: "text-signal",
};

// What shows before the animation starts, without JavaScript, and under reduced motion.
const FIRST_FRAME = renderFrame(0);

// The logo's v in animated ASCII. Decorative, so hidden from assistive tech and search snippets.
export function HeroAscii() {
  const [a, b, c] = hero.orbitLabels;

  return (
    <AsciiPlayer>
      <Stagger onLoad delay={0.15} stagger={0.12} aria-hidden className="absolute inset-0">
        <StaggerItem variant="scaleIn" className="absolute inset-0">
          <div data-nosnippet="" className="ascii-art">
            {LAYERS.map((name, i) => (
              <div key={name} className={`ascii-layer ${colour[name]}`}>
                {/* One element per row, so no block is big enough to replace the h1 as LCP. */}
                {FIRST_FRAME[i].map((line, row) => (
                  <div key={row} data-row="">
                    {line}
                  </div>
                ))}
              </div>
            ))}
          </div>
        </StaggerItem>
        <Pill className="top-[5%] right-[8%]">{a}</Pill>
        <Pill className="top-[12%] left-0">{b}</Pill>
        <Pill className="right-[6%] bottom-[7%]">{c}</Pill>
      </Stagger>
    </AsciiPlayer>
  );
}

function Pill({ className, children }: { className: string; children: React.ReactNode }) {
  return (
    <StaggerItem
      as="span"
      variant="pop"
      className={`label absolute rounded-full border border-border bg-background px-3.5 py-2 text-[11px] text-foreground shadow-[0_8px_24px_-12px_rgb(27_27_27/0.25)] ${className}`}
    >
      {children}
    </StaggerItem>
  );
}
