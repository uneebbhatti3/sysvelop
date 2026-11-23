# Design Direction: Sysvelop Website

> **Direction change (Nov 2026, owner request): editorial studio style.** Overrides §3 to §8 where they conflict.
> - Inspired by the layout language of an owner-supplied reference site (studied, not copied: no text, imagery or brand colour reused).
> - Colours: paper #f7f7f4, ink #1b1b1b, muted #6b6b68 (body) / dim #8a8a86 (large display only), logo blue #003cff as the
>   single accent, light-blue band #cdd9ff, blue wash #e6ecff on cards. Contact section and footer are an ink band (`.theme-ink`).
> - Type: Space Grotesk 500 for display (`.display`, tracking -0.055em, line-height 0.92), DM Sans for body,
>   uppercase tracked `.label` for eyebrows and nav. Headings dim their last words (`SplitText`, visual only).
> - Components: pill buttons (ink filled / outlined), square outlined nav button, numbered-circle tint cards,
>   oversized numbered service rows, timeline list on the blue band, scrolling discipline ticker.
> - Motion: an animated ASCII 3D logo "v" in the hero (`components/hero`: text only, 15 fps, on screen only, pausable, desktop and tablet only) and the ticker, both static under prefers-reduced-motion.
> - Not adopted (CLAUDE.md rules): process section, team/founder card, client logos, stat counters. Testimonials are shown only when real and published by the owner.
> - Pages: `/` (Hero, Why, Services, Industries, Work, Engagements, Technologies, Ticker, FAQ, Contact), `/services`, `/services/[slug]`.

Goal: a futuristic, modern, restrained site that reads as established and technically excellent. The design must also be fast: the site is itself the proof of Sysvelop's speed claim.

## 1. How to use the reference images

The owner has placed three reference images in `/public/reference/`. Before writing any UI code:

1. Open each image (Playwright or image read) and study it.
2. Write `docs/DESIGN-ANALYSIS.md`: for each reference, what to adopt, what to leave, and why; then a short proposal of tokens and the hero concept.
3. **Stop and show it for approval** (Checkpoint 1 in `docs/TASKS.md`).

The references are inspiration only. Do not copy layouts, copy text, or reuse their imagery. The folder must never be deployed (see `docs/TRD.md`).

## 2. What the references show, and what to take

**Reference 1: dark violet AI-automation landing page**

- Near-black background with a violet glow; centered headline above a luminous arc.
- Small pill-shaped eyebrow labels above each section heading.
- **Bento grid of large rounded dark cards, each holding a mini diagram** (icons converging on a central node, workflow lines, connected nodes).
- Node-and-line diagrams as a visual language for "connected systems".
- Two-column FAQ accordion; gradient call-to-action banner; very large, faded wordmark in the footer.
- _Take:_ dark base, glow used sparingly, pill eyebrows, bento cards with diagrams, node-link motif, oversized footer wordmark.
- _Leave:_ pricing tables, testimonial cards, "trusted by 150,000+ users" claims, any AI-agent framing.

**Reference 2: light software-house site**

- Airy, light lavender layout with a large, clean, centered headline and generous whitespace.
- Clear hierarchy; alternating text/visual rows; simple icon-led services grid; selected-work cards on soft gradients.
- _Take:_ clarity of hierarchy, whitespace discipline, simple services grid, selected-work card structure.
- _Leave:_ light theme, team photography, counters about team size, blog, logo strip of other brands, generic "passionate" language.

**Reference 3: dark blue AI-support landing page**

- Deep blue background with vertical light streaks (like light through curtains).
- **Monospace headline typeface**, minimal nav, and a glowing, thin-bordered product-UI card (a chat box) directly under the headline as the hero visual.
- _Take:_ the monospace typographic voice for labels, the glowing bordered product-UI card as the hero visual, vertical light-streak background (CSS gradients, not images).
- _Leave:_ chatbot framing, logo row.

> **§3 to §8 below describe the original dark concept and are kept for history.** The built site follows the direction-change note at the top; `src/app/globals.css` is the source of truth for tokens and fonts.

## 3. Design concept: "quiet futurism"

Dark-first, confident, minimal. The futuristic feel comes from precision (thin borders, monospace labels, soft glows, diagram lines), not from effects. One luminous accent colour, used sparingly. Premium is conveyed by restraint, spacing, and craft, never by stock imagery or the word itself.

**Visual metaphor:** a connected system. Nodes, lines, and small UI cards show things working together.

## 4. Hero concept

- Centered or left-aligned large headline (the tagline), subheading, two buttons.
- Beneath it, a **booking-flow card built entirely in HTML/CSS** (no images): a thin glowing border, a monospace label ("Booking"), three time slots, one slot becomes selected, then a "Confirmed" state with a check, then a line "Reminder scheduled". Loops slowly (about 8 to 10 seconds). With `prefers-reduced-motion`, show the final confirmed state statically.
- Faint node-and-line SVG behind the card, with lines drawn by `stroke-dashoffset` animation (CSS only).
- Background: subtle vertical light streaks and one radial glow using CSS gradients. No large images, no video, no canvas.
- The headline text must be the LCP element.

This visual demonstrates "simple to book" without any fake data. Use generic labels only (no customer names, no real businesses).

## 5. Tokens (proposal; override with the logo's colours)

Set as CSS variables in `globals.css` and map them to the shadcn tokens.

```
--background:      #05060B   near-black with a faint indigo undertone
--surface:         #0B0D16
--surface-raised:  #11141F
--border:          rgba(255,255,255,0.08)
--border-strong:   rgba(255,255,255,0.16)
--foreground:      #F4F5F9
--muted:           #9AA0B4   must stay ≥ 4.5:1 on --background
--accent:          derive from the logo; fallback #6C5CFF (violet)
--accent-glow:     accent at 25 to 35% opacity
--highlight:       #3DD6F5   cyan, tiny touches only (status dots, diagram nodes)
```

- Inspect `/public/brand/` for the logo. If it has a dominant colour, use it for `--accent` and tune the rest around it.
- Dark theme only at launch.

## 6. Typography

- **Sans:** Geist Sans (via `next/font`) for headings and body.
- **Mono:** Geist Mono for eyebrows, small labels, metric captions, and the booking card.
- **Headline:** very large, tight tracking (-0.02 to -0.03em), weight 500 to 600, `clamp()` sizing from about 36px (mobile) to 84px (desktop). Max line length about 14 to 18 characters per line for the hero.
- **Body:** 16 to 18px, line-height about 1.6, muted colour for secondary text.
- Preload nothing extra; use `display: swap` or `optional` to protect LCP.

## 7. Layout and components

- Max content width about 1200px; 24px side padding on mobile, 40px or more on desktop.
- Section spacing generous: about 96 to 160px vertical on desktop.
- Cards: radius 16 to 20px, 1px `--border`, background `--surface`, faint inner top highlight, hover raises border to `--border-strong` and adds a soft accent glow.
- Pill eyebrow above each section heading: mono, uppercase or small caps, small dot in accent.
- Bento grid for "Why one system": uneven card sizes on desktop, single column on mobile. Each card contains a small code-built diagram or icon cluster, never a photograph.
- Services: three columns (Build / Automate / Grow) with thin icons (lucide), item lists.
- FAQ: native `<details>`; two columns on desktop (heading left, questions right).
- Final CTA: gradient banner using the accent, with the contact form.
- Footer: oversized faded wordmark ("Sysvelop") with a gradient fade, as in Reference 1.
- Buttons: primary = solid accent or white; secondary = ghost with border. Visible focus rings.

## 8. Motion

- Only `transform` and `opacity` animate.
- Entrances: fade and 8 to 12px translate, 400 to 600ms, ease-out, light stagger, triggered once on entering the viewport.
- One ambient animation (hero booking card and node lines). Nothing else loops.
- No parallax, no scroll-jacking, no cursor effects, no autoplay video.
- Respect `prefers-reduced-motion` everywhere.
- Use the primitives in `components/motion`; no animation library on the public site.

## 9. Imagery

- No stock photos, no people, no AI-generated imagery.
- All visuals are built in code (SVG, CSS, HTML) or are real screenshots of real projects supplied by the owner.
- Project screenshots (when supplied) use `next/image` with correct dimensions and AVIF/WebP.

## 10. Accessibility

- WCAG 2.2 AA contrast. Check `--muted` on `--background` and on `--surface`.
- Semantic landmarks, one `h1`, logical heading order, skip link, visible focus.
- Keyboard-operable nav, menu, accordion, and form.
- Animated hero content must have a static equivalent.

## 11. Do and don't

**Do:** whitespace, thin borders, monospace labels, restrained glow, diagrams, consistent spacing scale, real data only.
**Don't:** stock imagery, gradient overload, glassmorphism everywhere, fake logos, fake numbers, team or founder imagery, giant hero videos, emoji, lorem ipsum, decorative blur filters over large areas (they hurt performance).
