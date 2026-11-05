# Design Analysis: Sysvelop Website

Phase 0 deliverable. Status: **awaiting owner approval (Checkpoint 1)**. Nothing in this file overrides `docs/`; where this file and the docs disagree, the docs win.

---

## 1. Inputs reviewed

| Input | Finding |
|---|---|
| `docs/*` | Read in full: PRD, CONTENT, DESIGN, TRD, SECURITY, QA, TASKS |
| `/public/reference/1.png`, `2.png`, `3.png` | Studied (findings in §2). Now git-ignored and in `.vercelignore` |
| Logo | **Not in `/public/brand/`.** Found at `/public/logo.png`: a 101 × 23 px PNG, lowercase wordmark "sysvelop". Letters are near-black `#080808` on a transparent background, and the **"v" is electric blue ≈ `#003CFF`** (measured from the pixels) |
| Installed skills | Only **`design-taste-frontend`** (tasteskill 2.5.0, `Leonxlnx/taste-skill`). `high-end-visual-design`, `minimalist-ui` and the image skills are **not installed** |

**Logo implications.** The blue "v" gives a real brand colour, so the accent is drawn from the logo instead of the violet fallback. As supplied, though, the logo cannot be used on the site: dark letters disappear on a dark-only theme, and 101 px wide is too small for retina screens. See Open question 1.

---

## 2. References: adopt, leave, and why

### Reference 1: dark violet AI-automation page

| Adopt | Why |
|---|---|
| Near-black base with **one** restrained glow | Gives the "quiet futurism" mood at almost no rendering cost |
| Small pill eyebrows above section headings | Gives every section the same clear entry point |
| Bento grid of dark rounded cards, each holding a small diagram | Fits the "one connected system" message, and the diagrams carry the message without photos |
| Node-and-line motif | Our visual metaphor for connected systems |
| Two-column FAQ (heading left, questions right) | Specified in DESIGN §7 |
| Oversized faded footer wordmark | A strong brand close that costs only text |

| Leave | Why |
|---|---|
| Violet palette | Our accent comes from the logo blue. A violet copy would also read as the reference |
| Logo strip, "trusted by 150,000+", pricing tables, testimonials | These are invented or out-of-scope proof (CLAUDE.md non-negotiable 2; PRD §5) |
| The "About" paragraph with half-faded text, and the agent framing | Team and process talk, plus the wrong audience |
| The luminous arc under the headline | It is that page's signature. Our hero visual is the booking card |
| Its exact grid proportions, icons and diagram drawings | Copying layouts is banned. Our bento proportions follow our four cards |

### Reference 2: light software-house page

| Adopt | Why |
|---|---|
| A clear hierarchy: one idea per section, centered heading, short intro | Owners decide in seconds, so the order of reading must be obvious |
| Whitespace discipline | The main signal of quality on a restrained site |
| Simple services grid: icon, title, short line, list | Maps directly onto Build / Automate / Grow |
| Selected-work card structure: visual on top, name and tags below | The base for Work cards, reordered so the result comes first (CONTENT §5) |

| Leave | Why |
|---|---|
| Light theme and lavender tints | The site is dark-only (PRD §5) |
| Team photos, "29 experienced team members", the experienced-team block | These reveal the team (non-negotiable 1) |
| Brand logo strip, testimonial with portrait, blog/insights | Invented proof, or out of scope |
| "Passionate", "solutions" style copy | Banned words. Our copy is fixed in CONTENT.md |
| Stock photography | Banned (DESIGN §9) |

### Reference 3: dark blue AI-support hero

| Adopt | Why |
|---|---|
| Monospace voice for labels and small UI text | Gives precision cheaply (Geist Mono, already a project font) |
| A glowing, thin-bordered product-UI card directly under the headline | The model for our **booking card**: a working product shown instead of described |
| Vertical light streaks in CSS | Gives atmosphere with no image and no canvas. It suits a blue accent |
| Minimal nav with a single outlined action | Keeps the hero calm |

| Leave | Why |
|---|---|
| A monospace **headline** | Headlines stay in Geist Sans per DESIGN §6. Mono is for labels only |
| Full-height curtain streaks across the whole hero | That is the reference's signature, and it competes with text contrast. Ours are fewer and sit behind the card (§5) |
| Chat-box framing, emoji, logo row | Wrong product, emoji are banned, and the logos are invented proof |

---

## 3. Skill review and preflight answers

### 3.1 Review of `design-taste-frontend` (treated as a third-party dependency)

I read `SKILL.md` in full and the parts of its references that apply (`system.md`, `motion.md`, `diagrams.md`, `backgrounds.md`, `perf.md`). I also scanned its scripts for network and process calls.

**Security notes.** The scripts start headless Chrome, and several fetch from the network: `icons.mjs` pulls from jsDelivr, `photos.mjs` pulls from picsum.photos and Wikimedia, and `consistency.mjs` fetches every link on a page. **I ran none of the skill's scripts.** The skill does not need to run for us to use its taste guidance. Its folder is now excluded from ESLint.

**Adopted (taste only):**
- **One system:** one primary and one secondary button style, one card recipe, one radius family, one link style, one heading scale.
- **Spacing on a 4 px scale.** Heading to content is 48 px (32 on mobile). Cards sit 24 px apart (16 on mobile).
- **Text people read** is at least 16 px, line-height 1.5 to 1.7, and at least 7:1 contrast. Muted colour is for labels and meta only. Line length is capped at about 62 characters.
- **Sentence-case headings.** Highlight by contrast, not by colour.
- **Hover micro-interactions:** linked cards lift 2 px, buttons step on hover and press on click, the border brightens. Nothing tilts.
- **Any loop over 5 seconds gets a pause control.** This matches WCAG 2.2.2, which the PRD's WCAG 2.2 AA target requires (see §5.1).
- **Opaque sticky nav with a 1 px hairline, and no backdrop blur.** This also helps performance.
- **No violet.** This agrees with the logo-blue accent.

**Overridden by the docs (the docs win):**

| Skill instruction | Decision | Source |
|---|---|---|
| Copy `assets/`, start from `starter.html`, use `system.css` | Not used. We build Next.js components with Tailwind tokens | TRD §1–2 |
| Write all the copy first; one "hard fact" on the first screen | Copy is fixed. No verified fact exists yet, so none is shown | CLAUDE.md 2 and 4 |
| Photographs via `photos.mjs`; full-colour third-party icons via `icons.mjs` | Rejected: stock imagery, remote fetches, implied client logos | DESIGN §9, SECURITY §6 |
| Shader grounds, WebGL objects, "moments", "scenes" | Rejected | CLAUDE.md 5, TRD §4 |
| Randomly "dealt" palette, type and hero | Rejected. Palette comes from the logo, type is Geist | DESIGN §5–6 |
| Its "service" classification bans dark pages and grounds | Overridden: dark-only with light streaks is specified | PRD §5, DESIGN §4 |
| No entrance fades | DESIGN §8 allows restrained entrances. Kept minimal: once, below the hero only, never on the `h1` | DESIGN §8 |
| FAQs fully open, no accordion | Accordion as specified | PRD §6.7 |
| Never tracked capitals | Eyebrows stay mono uppercase as specified, with light tracking | DESIGN §7 |
| Never use a browser tool; check only with the skill's scripts | QA uses Playwright per QA.md | QA §1 |
| One section per screen as a hard rule | Treated as guidance (generous section spacing), not a constraint | DESIGN §7 |

### 3.2 Preflight answers (skill step 1, "read the brief"), answered from the docs

| Question | Answer |
|---|---|
| Kind of business | A studio hired to build software for clients. The skill's table calls this "service"; the docs set the visual treatment (dark, diagrams) |
| What is sold | Websites, web and mobile apps, AI automation, SEO and social media |
| Who buys | Owners of small and growing businesses in the US, UK, UAE and Canada. Non-technical and short on time |
| One main action | **Start a project** (scrolls to the contact form) |
| Secondary action | See our work (hidden while Work is empty, see Open question 5) |
| Real material available | Logo PNG and approved copy. No photos, no project screenshots, no proof values yet |
| Hard fact on first screen | None until the owner supplies verified proof. The booking card demonstrates the claim instead of stating it |
| Hero type | Text plus live product UI (the booking card) |
| Radius | Soft (cards 20 px, panels 12 px, controls 10 px, pills fully rounded) |
| Effects | None beyond CSS gradients and one inline SVG |

### 3.3 Recommended direction: "Signal on dark"

Quiet futurism keyed to the logo blue. A near-black, slightly cool canvas. One electric-blue accent used like a signal: on the primary button, on the eyebrow dots, and along the pulse that runs through the node lines when a booking confirms. Everything else stays neutral. Precision comes from thin 1 px borders, mono labels, and exact alignment on a 12-column grid. The page "lights up" only where something happens, so the hero tells the story *a customer books, the system handles the rest*.

### 3.4 Alternative direction: "Blueprint"

A flatter, more technical look. A faint 24 px grid pattern on the hero and bento, mono used more widely (card titles and metrics), square-ish 8 px radii, and no glows at all: blue only as line colour and the primary button. It reads more "engineering studio" and is slightly faster still. The cost is that it feels colder to non-technical owners and further from the luminous mood of References 1 and 3.

---

## 4. Proposed design tokens

### 4.1 Colour

Base values follow DESIGN §5. Only the accent changes, from the violet fallback to the logo blue. All ratios below are measured (WCAG 2.x).

| Token | Value | Use | Contrast |
|---|---|---|---|
| `--background` | `#05060B` | Page | |
| `--surface` | `#0B0D16` | Cards, footer | |
| `--surface-raised` | `#11141F` | Booking card body, inputs, hovered rows | |
| `--border` | `rgba(255,255,255,0.08)` | Hairlines, card borders | |
| `--border-strong` | `rgba(255,255,255,0.16)` | Hover borders, inputs | |
| `--foreground` | `#F4F5F9` | Text | 18.6 / 17.8 / 16.9 :1 on bg / surface / raised |
| `--muted` | `#9AA0B4` | Secondary text and labels | 7.8 / 7.4 / 7.1 :1 |
| `--brand` | `#003CFF` | **The logo's exact blue.** Logo only; never text | 2.98:1 on bg, too low for UI |
| `--accent` | `#1F4BFF` | Primary button fill, glows, node pulse | 3.4:1 on bg (passes the 3:1 for UI components); white label on it 6.0:1 |
| `--accent-text` | `#7A93FF` | Accent text on dark, links, eyebrow dot | 7.2 / 6.9 / 6.5 :1 |
| `--ring` | `#5B7BFF` | Focus ring (2 px with 2 px offset) | 5.5:1 on bg |
| `--accent-glow` | `rgb(31 75 255 / 0.30)` | Radial glow, card hover glow | decorative |
| `--highlight` | `#3DD6F5` | Tiny touches: confirmed check, diagram nodes, status dots | 11.7:1 |
| `--danger` | `#FF7A7A` | Form errors | 8.0 / 7.7 / 7.3 :1 |

**Why lift the blue:** the logo's `#003CFF` reaches only 2.98:1 against the near-black, so as a button edge or text it fails AA. `#1F4BFF` keeps the hue and clears 3:1 for UI. The lighter `#7A93FF` carries any blue text. The exact logo blue stays reserved for the logo.

**shadcn mapping** in `globals.css`: `--primary` → `--accent`, `--primary-foreground` → `#FFFFFF`, `--card` → `--surface`, `--popover` → `--surface-raised`, `--muted` (a background in shadcn) → `--surface-raised`, `--muted-foreground` → `--muted`, `--border` / `--input` → `--border` / `--border-strong`, `--ring` → `--ring`, `--destructive` → `--danger`. The `.dark` block becomes the only theme; the light `:root` defaults are replaced.

### 4.2 Type

Geist Sans and Geist Mono via `next/font` (variable fonts, Latin subset, `display: swap`). **Inter is removed** from `layout.tsx`: shadcn init added it, TRD names only Geist, and dropping it saves one font file.

| Role | Size (mobile → desktop) | Weight | Line-height | Tracking |
|---|---|---|---|---|
| Display (`h1`) | `clamp(2.25rem, 1.2rem + 4.5vw, 5.25rem)` → 36 to 84 px | 560 | 1.02 | −0.03em; max-width about 16ch |
| `h2` | `clamp(1.875rem, 1.3rem + 2.2vw, 3rem)` → 30 to 48 px | 560 | 1.1 | −0.02em |
| `h3` / card title | 1.25rem (20 px) | 550 | 1.3 | −0.01em |
| Lead / descriptor | 1.125rem → 1.25rem (18 to 20 px) | 400 | 1.6 | 0 |
| Body | 1rem → 1.0625rem (16 to 17 px) | 400 | 1.6 | 0 |
| Small / meta | 0.875rem (14 px), meta only | 400 | 1.5 | 0 |
| Mono label / eyebrow | 0.75rem → 0.8125rem (12 to 13 px), uppercase | 500 | 1.2 | 0.06em |
| Booking card (mono) | 0.875rem (14 px) | 400 to 500 | 1.4 | 0 |

### 4.3 Spacing, layout, radius

- **Scale (4 px base):** 4 · 8 · 12 · 16 · 24 · 32 · 48 · 64 · 96 · 128 · 160 (Tailwind's default steps; no arbitrary values).
- **Container:** max 1200 px. Side gutter 24 px (mobile), 40 px (≥768), 64 px (≥1280).
- **Section padding:** 96 px (mobile) / 128 px (≥1024) vertical. The hero is shorter: header height plus 64 top, 96 bottom.
- **Heading to content:** 32 px mobile / 48 px desktop. **Card gap:** 16 / 24 px.
- **Radius:** cards 20 px, inner panels 12 px, inputs and buttons 10 px, pills and eyebrows fully rounded. One family only.
- **Controls:** buttons and inputs 44 px tall (48 px on mobile); tap targets at least 44 × 44.
- **Grid:** 12 columns, 24 px gap (16 on mobile). Bento uses 7/5 and 5/7 splits on desktop and one column on mobile.

---

## 5. Hero concept

Order: eyebrow pill (mono) → `h1` tagline → descriptor → two buttons → booking card with node lines behind it. Everything sits on a hero background of streaks plus one glow. Centered on desktop, left-aligned on mobile for easier reading.

**LCP rule.** The `h1` is server-rendered text with no entrance animation, no opacity gate, and no JS dependency. The font uses `swap`, so text paints immediately.

### 5.1 Booking card (HTML and CSS, Server Component)

- A 1 px border with an inner top highlight and a soft `--accent-glow` box-shadow (static).
- Mono label "Booking", rows "Tue 09:30", "Tue 10:30", "Tue 11:30", then "Confirmed" with a check, then "Reminder scheduled". Copy comes from `src/content/`.
- **One 9-second CSS keyframe cycle.** 0–2 s idle, 2 s the 10:30 row highlights (an opacity layer plus `transform: scale`), 4 s the "Confirmed" row fades and slides in, 5.5 s "Reminder scheduled" appears, it holds until 8 s, then resets. Only `opacity` and `transform` animate.
- **No layout shift:** every state's row is always in the DOM with reserved height. States differ only in opacity and transform, so CLS stays 0.
- **Reduced motion:** `@media (prefers-reduced-motion: reduce)` disables the animation and renders the final confirmed state statically. It also works with JavaScript off.
- **Pause control (WCAG 2.2.2).** The loop runs more than 5 seconds next to other content, so it needs a way to stop it. A small pause/play button in the card's corner toggles `animation-play-state`. That is the only client JavaScript in the hero (about 1 KB, one tiny `"use client"` leaf). See Open question 4.
- Accessibility: the visual is `aria-hidden`, with a visually hidden text summary ("Example booking: a customer picks Tuesday 10:30, the booking is confirmed and a reminder is scheduled"). Proposed copy, see Open question 6. No real names or businesses appear.
- **Cost:** about 2 KB HTML and CSS, no images, no JS except the pause toggle.

### 5.2 Node-line background (inline SVG)

- About 6 to 8 thin lines and small nodes fanning out from behind the card toward the edges, drawn in `--border-strong`. Nodes use `--highlight` at low opacity.
- On load the lines draw in once (`stroke-dashoffset`, about 1.2 s, CSS only). After that a single short accent dash travels one line in sync with the card's "Confirmed" moment, on the same 9 s cycle. The card and the lines count as **one** ambient animation (DESIGN §8), and the same pause button stops both.
- `stroke-dashoffset` repaints rather than compositing. DESIGN §4 explicitly allows it, and the cost is negligible on an SVG this small (about 1.5 KB). Under reduced motion the lines appear fully drawn and still.
- `aria-hidden`, `pointer-events: none`. Under 640 px a simplified 3-line variant is used so the card fits at 320 px.

### 5.3 Light-streak background (CSS gradients)

- One absolutely positioned layer: a `repeating-linear-gradient(90deg, …)` of narrow, uneven blue streaks (4 to 8 % alpha), plus one `radial-gradient` glow (`--accent-glow`) centred behind the card.
- `mask-image: linear-gradient(to bottom, transparent, #000 35%, transparent)` keeps the area behind the headline near-black. Text contrast stays above 15:1, and the look stays clearly different from Reference 3's full-height curtain.
- **Static:** no animation, no `filter: blur`, no `backdrop-filter`, no image, no canvas. It costs one paint and zero JS.

### 5.4 Budget summary

| Item | JS | Bytes (approx.) | Main-thread work |
|---|---|---|---|
| Headline and buttons | 0 | text | none |
| Booking card | about 1 KB (pause toggle) | about 2 KB CSS/HTML | compositor-only animation |
| Node lines | 0 | about 1.5 KB SVG | tiny repaint per frame on a small area |
| Streaks and glow | 0 | about 0.5 KB CSS | one paint |

Target: LCP = `h1`, LCP ≤ 1.8 s, CLS ≤ 0.05, TBT ≈ 0 for the hero.

---

## 6. Components plan

### 6.1 shadcn/ui (project style: `base-vega`, built on Base UI)

| Component | Use | Notes |
|---|---|---|
| `button` | All buttons (installed) | Restyle variants to the tokens: `default` = accent fill, `outline` = ghost with border. Remove unused variants |
| `accordion` | FAQ | Check keyboard handling and that the open/close animation uses height via grid rows or none (reduced motion) |
| `sheet` | Mobile nav | Focus trap, Escape to close, return focus to the trigger |
| `field`, `label`, `input`, `textarea` | Contact form (Phase 3) | Inline errors through `aria-describedby` |
| Native `<select>` (styled) | "What do you need?" | Preferred over the Base UI Select: lighter, better on mobile, accessible by default |

**Review notes.**
- The shadcn **MCP** reports `radix-ui` as a dependency for `accordion` and `sheet`. A **CLI dry run** (`npx shadcn add accordion sheet --dry-run`) resolves the project's Base UI style and adds only `cn`, no Radix. I will always add components via the CLI and check with `--dry-run` first, so we never ship two primitive libraries.
- `cn` (`shadcn-ui/cn`, replaces `clsx` + `tailwind-merge`) and `@base-ui/react` were added by shadcn init. Neither is named in TRD. They are shadcn's own dependencies, which TRD covers in spirit. Flagged for completeness only.
- The placeholder `@acme` registry (`https://acme.com/r/...`) has been **removed** from `components.json`.

### 6.2 21st.dev: inspiration only by default

Search works (verified). Candidates looked at by metadata only (no code retrieved):
- Bento grids (`kokonutd/bento-grid` #622, `tommyjepsen/feature-section-with-bento-grid` #1327). The layout is a few lines of CSS grid, so I'll **build it by hand**.
- Wordmark footers (`kedhareswer/beam-wordmark-footer` #35251, `kiln-wordmark-footer` #35508). **Reject the code:** they use pointer-tracking glows, spring physics and procedural SVG alphabets (cursor effects are banned, DESIGN §8). I'll take only the idea of a giant wordmark cropped by the bottom edge, which is pure CSS text.

**Plan:** build hero, bento, footer and diagrams by hand with zero new dependencies. If a specific 21st component is ever worth fetching, I'll get its source with `get_component`, review it per TRD §5 (no remote assets, tracking, `eval`, heavy dependencies), strip it, and **hand-copy** it with an origin comment. I won't run its install command: those URLs carry the API key as a query parameter (`?api_key=…`), which can leak into shell history and logs, and they pull `registryDependencies` unreviewed.

---

## 7. Phase 0 setup done

- Project is Next.js 16.4.5 (App Router) + TypeScript strict + Tailwind v4 + shadcn (`base-vega`). Not re-initialised.
- Playwright 1.64.1 (below 1.65.0 as requested) and `@axe-core/playwright` were already installed. Chromium is present.
- `.gitignore`: `public/reference/`, `.claude/settings.local.json`, Playwright and QA output; `!.env.example` re-included. `.vercelignore` excludes `public/reference/`.
- `.env.example` (names only) and `.nvmrc` (`24`). `engines.node >= 24` in `package.json`.
- Scripts added: `typecheck`, `check` (lint + typecheck + build), `qa:shots` (`scripts/qa-shots.mjs`: screenshots at 375/768/1280/1536, console errors, failed requests, horizontal overflow, axe).
- ESLint ignores `.agents/` and `.claude/` (third-party skill code produced 243 lint problems).
- **Browser verification.** The Create Next App page referenced `/next.svg` and `/vercel.svg`, which had been deleted from `/public`. That caused 404s and console errors at every width (`qa/screenshots/phase0-default-*.png`). I replaced `page.tsx` with a one-line stub (the `h1` tagline only, no sections). The re-run is clean: **no console errors, no failed requests, no overflow, no axe violations** (`qa/screenshots/phase0-stub-*.png`). `npm run lint`, `npm run typecheck`, and `npx playwright test` all pass.

---

## 8. Open questions

1. **Logo file.** The only logo is a 101 × 23 px PNG with near-black letters, which is invisible on the dark theme and blurry on retina. Can you supply an **SVG** (ideally with a light-on-dark version)? Until then, which do you prefer: (a) a temporary recoloured light version of the PNG, or (b) the name set as live text in Geist with the blue "v", marked `TODO(owner)`?
2. **Accent.** Approve `#1F4BFF` for UI and `#7A93FF` for blue text (the exact logo `#003CFF` fails contrast on near-black)?
3. **Logo location.** OK to move `public/logo.png` to `public/brand/` in Phase 1, per PRD Open Decision #1?
4. **Hero pause button.** WCAG 2.2.2 needs a way to pause the looping card. OK to add a small pause/play control in the card corner?
5. **"See our work" button** while `projects.ts` is empty. The Work section is hidden then, so the button would point nowhere. Hide the button until projects exist?
6. **Proposed copy** (not in CONTENT.md, needs approval): screen-reader summary of the booking card: "Example booking: a customer picks Tuesday 10:30, the booking is confirmed, and a reminder is scheduled." Pause button labels: "Pause animation" / "Play animation".
7. **Skill files.** `.agents/`, `.claude/skills/` and `skills-lock.json` are uncommitted. Commit them, or git-ignore them as local tooling?
