import { BellRing, CalendarCheck, Globe, Smartphone, type LucideIcon } from "lucide-react";

// Decorative node-and-line field behind the hero booking card (desktop only).
// Lines draw in once (stroke-dashoffset), then a short pulse travels in toward the
// card and out toward the reminder, on the same 9s cycle as the card.
// viewBox matches the 1000x400 frame; the card sits in x 300–700.

const IN_PATHS = ["M104 130 C 200 130, 220 165, 300 165", "M104 270 C 200 270, 220 235, 300 235"];
const OUT_PATHS = ["M700 165 C 780 165, 800 130, 896 130", "M700 235 C 780 235, 800 270, 896 270"];
const FAINT_PATHS = [
  "M80 154 L80 246",
  "M920 154 L920 246",
  "M56 130 C 30 130, 20 90, 0 80",
  "M944 270 C 970 270, 980 310, 1000 320",
  "M56 270 L 10 270",
  "M944 130 L 990 130",
];
const TILES: { x: number; y: number; Icon: LucideIcon; lit?: boolean }[] = [
  { x: 80, y: 130, Icon: Globe },
  { x: 80, y: 270, Icon: Smartphone },
  { x: 920, y: 130, Icon: CalendarCheck },
  { x: 920, y: 270, Icon: BellRing, lit: true },
];
const DOTS = [
  [200, 60],
  [800, 52],
  [150, 350],
  [860, 352],
  [40, 200],
  [960, 200],
];

export function NodeLines() {
  return (
    <svg
      aria-hidden="true"
      focusable="false"
      viewBox="0 0 1000 400"
      className="pointer-events-none absolute inset-0 h-full w-full"
      fill="none"
    >
      <defs>
        <linearGradient id="nl-fade" x1="0" x2="1" y1="0" y2="0">
          <stop offset="0" stopColor="#fff" stopOpacity="0.05" />
          <stop offset="0.5" stopColor="#fff" stopOpacity="0.2" />
          <stop offset="1" stopColor="#fff" stopOpacity="0.05" />
        </linearGradient>
      </defs>

      {FAINT_PATHS.map((d) => (
        <path key={d} d={d} pathLength={1} stroke="rgb(255 255 255 / 0.07)" strokeDasharray="1" className="nl-draw" />
      ))}
      {[...IN_PATHS, ...OUT_PATHS].map((d) => (
        <path key={d} d={d} pathLength={1} stroke="url(#nl-fade)" strokeWidth={1.25} strokeDasharray="1" className="nl-draw" />
      ))}

      {IN_PATHS.map((d) => (
        <path
          key={`in-${d}`}
          d={d}
          pathLength={1}
          stroke="#7a93ff"
          strokeWidth={2}
          strokeLinecap="round"
          strokeDasharray="0.12 2"
          className="nl-pulse nl-pulse-in"
        />
      ))}
      {OUT_PATHS.map((d) => (
        <path
          key={`out-${d}`}
          d={d}
          pathLength={1}
          stroke="#3dd6f5"
          strokeWidth={2}
          strokeLinecap="round"
          strokeDasharray="0.12 2"
          className="nl-pulse nl-pulse-out"
        />
      ))}

      {DOTS.map(([cx, cy]) => (
        <circle key={`${cx}-${cy}`} cx={cx} cy={cy} r={2} fill="#3dd6f5" fillOpacity={0.35} />
      ))}

      {TILES.map(({ x, y, Icon, lit }) => (
        <g key={`${x}-${y}`}>
          <rect
            x={x - 24}
            y={y - 24}
            width={48}
            height={48}
            rx={12}
            fill="#0b0d16"
            stroke={lit ? "rgb(61 214 245 / 0.45)" : "rgb(255 255 255 / 0.12)"}
          />
          <Icon x={x - 11} y={y - 11} width={22} height={22} strokeWidth={1.5} color={lit ? "#3dd6f5" : "#9aa0b4"} />
        </g>
      ))}
    </svg>
  );
}
