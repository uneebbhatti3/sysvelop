// ASCII scene for the hero: the logo's "v" as an extruded solid, with an orbit carrying
// signals around it. A pure function of time with no imports, so the server renders the first
// frame and the browser the rest, at a fraction of a millisecond each.

export const COLS = 80;
export const ROWS = 48; // the font is 0.6em wide, so this grid is square

/** One text layer per colour, back to front. */
export const LAYERS = ["orbit", "signal", "side", "face"] as const;
const ORBIT = 0;
const SIGNAL = 1;
const SIDE = 2;
const FACE = 3;

// The logo's v, split down the middle into two convex halves (counter-clockwise, y up).
const LEFT = [[-0.64, 0.55], [-0.15, -0.58], [0, -0.58], [0, -0.22], [-0.335, 0.55]];
const RIGHT = LEFT.map(([x, y]) => [-x, y]).reverse();
const DEPTH = 0.17;

// Planes as [nx, ny, nz, d]. Inside is where n·p <= d. The caps come first.
const SOLIDS = [LEFT, RIGHT].map((shape) => [
  [0, 0, 1, DEPTH],
  [0, 0, -1, DEPTH],
  ...shape.map(([x, y], i) => {
    const [x2, y2] = shape[(i + 1) % shape.length];
    const length = Math.hypot(x2 - x, y2 - y);
    const nx = (y2 - y) / length;
    const ny = -(x2 - x) / length;
    return [nx, ny, 0, nx * x + ny * y];
  }),
]);

const FACE_RAMP = "-=+*xX#%@";
const SIDE_RAMP = ".:;/|";
const TRAIL = "@#*+=-:.";

// Two tracks in one plane, like a planet's rings. The near half passes in front of the v.
const TILT = 1.2; // away from the viewer
const ROLL = 0.3; // in the plane of the screen
const ORBITS = [
  { radius: 0.99, speed: 0.085, signals: 3, near: "=", far: "-" },
  { radius: 0.84, speed: -0.06, signals: 0, near: ":", far: "." },
];

const TAU = Math.PI * 2;
const clamp = (v: number, min: number, max: number) => Math.min(max, Math.max(min, v));

// Reused every frame, so animating allocates very little.
const chars: string[] = new Array(COLS * ROWS);
const layer = new Uint8Array(COLS * ROWS);
const depth = new Float32Array(COLS * ROWS);

function plot(x: number, y: number, z: number, char: string, into: number) {
  const col = Math.floor(((x + 1) / 2) * COLS);
  const row = Math.floor(((1 - y) / 2) * ROWS);
  if (col < 0 || col >= COLS || row < 0 || row >= ROWS) return;
  const i = row * COLS + col;
  if (z < depth[i]) return;
  depth[i] = z;
  chars[i] = char;
  layer[i] = into;
}

function drawLogo(time: number) {
  // It sways rather than spins, so it always reads as the v.
  const yaw = -0.52 * Math.cos(time * 0.55);
  const pitch = 0.2 + 0.1 * Math.sin(time * 0.37);
  const bob = 0.025 * Math.sin(time * 1.1);
  const cy = Math.cos(yaw);
  const sy = Math.sin(yaw);
  const cp = Math.cos(pitch);
  const sp = Math.sin(pitch);

  // The view ray (0, 0, -1) in the solid's own space. It is the same for every cell.
  const dx = sy * cp;
  const dy = -sp;
  const dz = -cy * cp;
  const glint = ((time * 0.42) % 3.4) - 1.5; // a band of light crossing the face

  for (let row = 0; row < ROWS; row++) {
    const y = 1 - ((row + 0.5) / ROWS) * 2 - bob;
    if (Math.abs(y) > 0.8) continue;
    for (let col = 0; col < COLS; col++) {
      const x = ((col + 0.5) / COLS) * 2 - 1;
      if (Math.abs(x) > 0.82) continue;

      // Ray origin (x, y, 2), rotated into the solid's space.
      const z1 = -sp * y + 2 * cp;
      const oy = cp * y + 2 * sp;
      const ox = cy * x - sy * z1;
      const oz = sy * x + cy * z1;

      let nearest = Infinity;
      let hit: number[] | null = null;
      for (const planes of SOLIDS) {
        let enter = -Infinity;
        let exit = Infinity;
        let through: number[] | null = null;
        for (const plane of planes) {
          const facing = plane[0] * dx + plane[1] * dy + plane[2] * dz;
          const gap = plane[3] - (plane[0] * ox + plane[1] * oy + plane[2] * oz);
          if (Math.abs(facing) < 1e-6) {
            if (gap < 0) exit = -Infinity;
          } else if (facing < 0) {
            if (gap / facing > enter) {
              enter = gap / facing;
              through = plane;
            }
          } else {
            exit = Math.min(exit, gap / facing);
          }
        }
        if (enter <= exit && enter < nearest) {
          nearest = enter;
          hit = through;
        }
      }
      if (!hit) continue;

      const z = 2 - nearest;
      if (hit[2] !== 0) {
        const px = ox + dx * nearest;
        const py = oy + dy * nearest;
        const shine = Math.max(0, 1 - Math.abs(px + py * 0.5 - glint) * 3.2);
        const ripple = 0.1 * Math.sin(px * 9 - py * 6 + time * 2.2);
        const light = clamp(0.45 + py * 0.34 - px * 0.16 + ripple + shine * 0.6, 0, 1);
        plot(x, y + bob, z, FACE_RAMP[Math.round(light * (FACE_RAMP.length - 1))], FACE);
      } else {
        const light = clamp(0.5 + hit[0] * 0.3 + hit[1] * 0.45, 0, 1);
        plot(x, y + bob, z, SIDE_RAMP[Math.round(light * (SIDE_RAMP.length - 1))], SIDE);
      }
    }
  }
}

// A faint field of points behind everything, twinkling as a wave passes through it.
function drawField(time: number) {
  for (let row = 2; row < ROWS; row += 4) {
    for (let col = 3; col < COLS; col += 6) {
      const x = ((col + 0.5) / COLS) * 2 - 1;
      const y = 1 - ((row + 0.5) / ROWS) * 2;
      const r = Math.hypot(x, y);
      if (r > 0.98) continue;
      plot(x, y, -9, Math.sin(r * 9 - time * 1.6) > 0.8 ? "+" : ".", ORBIT);
    }
  }
}

function drawOrbits(time: number) {
  const ct = Math.cos(TILT);
  const st = Math.sin(TILT);
  const cr = Math.cos(ROLL);
  const sr = Math.sin(ROLL);

  for (const { radius, speed, signals, near, far } of ORBITS) {
    const point = (angle: number, char: string, into: number, lift = 0, dx = 0, dy = 0) => {
      const x = Math.cos(angle) * radius;
      const flat = Math.sin(angle) * radius;
      const y = -flat * ct;
      plot(x * cr - y * sr + (dx * 2) / COLS, x * sr + y * cr + (dy * 2) / ROWS, flat * st + lift, char, into);
    };

    const steps = signals ? 360 : 84;
    for (let s = 0; s < steps; s++) {
      const angle = (s / steps) * TAU;
      // The far half is fainter than the near half.
      point(angle, Math.sin(angle) > 0 ? near : far, ORBIT);
    }

    const direction = Math.sign(speed);
    for (let n = 0; n < signals; n++) {
      const head = (time * speed + n / signals) * TAU;
      // Tail first, so each brighter character lands on top.
      for (let s = TRAIL.length * 3 - 1; s >= 0; s--) {
        point(head - direction * s * 0.022, TRAIL[Math.floor(s / 3)], SIGNAL, 0.01);
      }
      // The node at the head: a small diamond.
      for (let dy = -1; dy <= 1; dy++) {
        const reach = dy === 0 ? 2 : 1;
        for (let dx = -reach; dx <= reach; dx++) point(head, dx === 0 && dy === 0 ? "@" : "#", SIGNAL, 0.02, dx, dy);
      }
    }
  }
}

/** Every row of every layer. Rows are padded, so each is always COLS characters long. */
export function renderFrame(time: number): string[][] {
  chars.fill(" ");
  depth.fill(-Infinity);
  drawField(time);
  drawLogo(time);
  drawOrbits(time);

  return LAYERS.map((_, into) => {
    const rows: string[] = [];
    for (let row = 0; row < ROWS; row++) {
      let line = "";
      for (let i = row * COLS, end = i + COLS; i < end; i++) {
        line += chars[i] !== " " && layer[i] === into ? chars[i] : " ";
      }
      rows.push(line);
    }
    return rows;
  });
}
