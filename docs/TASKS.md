# Build Plan: Sysvelop Website

Work in phases. Stop at each **CHECKPOINT** and wait for the owner's approval before continuing. Tick items as they are completed and verified with the loop in `docs/QA.md`.

## Phase 0: Setup and design analysis

- [x] Confirm the project is a Next.js (App Router) + TypeScript app; initialise if not
- [x] Add Tailwind and shadcn/ui; verify the shadcn and 21st.dev MCPs respond
- [x] Install Playwright, its browsers, and `@axe-core/playwright`; confirm it can open `localhost`
- [x] Add `public/reference/` to `.gitignore` (and `.vercelignore` if needed)
- [x] Create `.env.example` (names only) and `.nvmrc`
- [x] Study every image in `/public/reference/` and inspect the logo in `/public/brand/`
- [x] Write `docs/DESIGN-ANALYSIS.md`: per-reference take/leave, proposed tokens (using the logo's colours), hero concept, any questions

**CHECKPOINT 1:** show `docs/DESIGN-ANALYSIS.md` and the proposed tokens. Wait for approval.

## Phase 1: Foundation

- [ ] Design tokens in `globals.css`, mapped to shadcn variables
- [ ] Fonts via `next/font` (Geist Sans, Geist Mono)
- [ ] Root layout, metadata, skip link, focus styles
- [ ] `src/content/` files: `site.ts`, `proof.ts` (empty values), `projects.ts` (empty), `faq.ts`
- [ ] Shared components: Logo, Nav (desktop and mobile), Eyebrow, Footer shell
- [ ] QA loop on the empty shell

## Phase 2: Sections

Build one at a time; run the QA loop after each.

- [ ] Hero (headline as LCP, booking card, node lines, light streaks)
- [ ] Proof strip (renders only with data)
- [ ] Why one system (bento with code-built mini diagrams)
- [ ] Services (Build / Automate / Grow)
- [ ] Work (data-driven; hidden when empty)
- [ ] FAQ (accordion)
- [ ] Final call to action
- [ ] Footer with oversized wordmark

**CHECKPOINT 2:** share desktop and mobile screenshots of the full page. Wait for design feedback.

## Phase 3: Contact form and security

- [ ] Zod schema shared by client and server
- [ ] Server action with honeypot, rate limit, and email sending
- [ ] Success, error, and loading states
- [ ] Security headers and CSP per `docs/SECURITY.md`
- [ ] Test every case in `docs/QA.md` §2

## Phase 4: Polish and SEO

- [ ] Motion pass (entrances, hover states, reduced-motion handling)
- [ ] Metadata, Open Graph image, JSON-LD, sitemap, robots
- [ ] Privacy and Terms pages (draft text clearly marked for owner review)
- [ ] 404 page
- [ ] Analytics and Speed Insights (cookieless), loaded after idle

## Phase 5: Verification

- [ ] Production build; Lighthouse mobile ≥ 95 across categories
- [ ] Bundle analysis; remove or defer anything unjustified
- [ ] Full accessibility, responsive, content, and security checks from `docs/QA.md`
- [ ] Banned-words grep clean

**CHECKPOINT 3:** present the final report (scores, screenshots, remaining `TODO(owner):` items).

## Phase 6: Pre-launch (owner actions)

- [ ] Supply real proof numbers and sources (`proof.ts`)
- [ ] Supply real projects and honest labels (`projects.ts`)
- [ ] Supply contact email and social links
- [ ] Set production environment variables
- [ ] Review Privacy and Terms text
- [ ] Confirm `/reference/*` returns 404 on the deployed site
- [ ] Re-run Lighthouse on the live URL
