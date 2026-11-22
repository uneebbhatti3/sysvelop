# Handoff: Sysvelop website

Written 22 Nov 2026 at commit `d84769b` ("admin side completed").
Read `CLAUDE.md` first, then this file. Where an older doc disagrees with this file, see [Stale docs](#stale-docs).

Contents: [Goal](#goal) · [Current state](#current-state) · [What changed](#what-changed) · [Files touched](#files-touched) · [What failed](#what-failed) · [What to do next](#what-to-do-next) · [Working notes](#working-notes)

---

## Goal

Sysvelop's marketing site turns small-business owners into enquiries, and is itself the proof that Sysvelop builds fast, polished systems.

What the owner asked for in this session, in order:

| # | Request | Status |
|---|---|---|
| 1 | Add Case studies and Services to the dashboard | Done |
| 2 | Keep Better Auth and basic security, remove the complex security, because it slowed development | Done |
| 3 | Testimonials: add them in the dashboard, plus a share link so clients can write their own | Done |
| 4 | Complete the frontend and make sure everything works | Built and tested. **Speed target missed**, analytics awaiting a decision |
| 5 | Use hello@sysvelop.com and the supplied logo | Done |
| 6 | Replace the hero circle with an animated ASCII image | Done |
| 7 | Explain and fix the localhost testimonial link | Fixed in code. **Needs env vars and a redeploy** |
| 8 | Confirm dashboard content shows on the frontend | Confirmed locally. **Not tested on Vercel** |

---

## Current state

### Code and deployment

- All the session's work is in `d84769b`, committed by the owner and present on `origin/main`. This file is the only new change after it.
- That exact commit passes a production build (isolated copy, no database). Typecheck and lint pass.
- **The Vercel deployment has not been checked.** Whether it succeeded, which domain serves it and which env vars are set are all unknown.
- `https://sysvelop.com` is an assumption taken from the email address. Confirm the domain, and whether it uses `www`.

### Database (Neon)

- **Local development and, as far as known, production share one Neon database.** Anything submitted on localhost is real data.
- The migration appears to have been run by the owner: a share link could be created, and the local home page renders queries that need the new tables. The database was not inspected directly.
- The agent ran no migrations or writes against Neon. All write tests used throwaway Docker Postgres.
- When last looked at, the local site showed 11 services, no published case studies and no published testimonials.

### Verification, and how far to trust it

| Check | Result | Caveat |
|---|---|---|
| Full browser suite (public pages, forms, dashboard) | 419 passed, 0 failed | **Ran before** the logo, email, header breakpoint, ASCII hero and link fix |
| Header fit, 320 to 1536px in 8px steps | Pass | After the logo change. The Work link was simulated |
| ASCII hero in Chromium, Firefox and WebKit at 4 widths | Pass | Not tried on a physical device |
| Testimonial link origin in 3 env setups | Pass | Vercel was simulated with an env var |
| Lighthouse accessibility, best practices, SEO | 100, 100, 100 | Local production build |
| **Lighthouse mobile performance** | **88 (home), 92 (service pages). Target is 95** | Home is the latest median. Service pages predate the logo. CPU slowdown calibrated to 2x for this laptop |
| **LCP** | **About 3.3s simulated, 2.7s with applied throttling. Target is 1.8s** | Same laptop |
| Homepage JavaScript | 187.6 KB gzipped, was 280 KB | Budget is about 130 KB. Next.js and React are about 125 KB of it |
| `npm audit --omit=dev` | 0 vulnerabilities | |
| Local secret values in committable files and git history | None found | Exact-value match only, not a full secret scan |

### Never tested

- Vercel cache invalidation (`updateTag`, then `revalidateTag` in `after`).
- A real sign-in or form submission against Neon after the security simplification.
- Whether the simplified rate limits actually block at their thresholds.
- The admin sidebar with the new logo.
- The error page (`src/app/error.tsx`).
- 200% zoom, newline injection in the contact form, `/reference/*` returning 404 on the deployed site.
- Delivery to hello@sysvelop.com.

---

## What changed

### 1. Dashboard-managed content

- **Routes:** `/admin/case-studies`, `/admin/services`, `/admin/testimonials`.
- **Tables:** `case_studies`, `services`, `testimonials`, `testimonial_link`, `content_seeds`.
- **Seeding:** `npm run db:migrate` copies the 11 built-in services once and never restores deleted ones. After that, editing `serviceList` in `src/content/services.ts` does not affect a migrated site.
- **Case studies and services:** draft or published, reorder, edit, delete. A version number stops two tabs overwriting each other. Service slugs are fixed after creation.
- **Case study screenshots:** resized to JPEG in the browser, stored in Postgres, served by `/work-image/[id]`.
- **Publishing rules:** copy is checked against `copy-rules.json` (banned words, emojis). For testimonials only the quote is checked.
- **Testimonials:** one reusable share link that can be replaced or turned off. Submissions require consent and always start unpublished. Client-written entries can't be edited.

### 2. How content reaches the site

```
dashboard action -> Postgres -> expireContent(tag) -> cached read -> static page
```

- Reads: `src/lib/content.ts` and `src/lib/testimonials.ts`, using `"use cache"` and `cacheTag`.
- Writes: `expireContent()` in `src/lib/content-cache.ts` expires the tag at once and again 5 seconds later. **Keep the second expiry.** It fixes a reproduced race.
- `/services/[slug]` exports `ensureStatic = "navigation"`. **Keep it.** Without it, regeneration fails at runtime while the build still passes.
- With no `DATABASE_URL` or no tables, the site silently falls back to the built-in services and no case studies or testimonials.

### 3. Security, simplified at the owner's request

- **Removed:** CSP, `Permissions-Policy`, COOP, site-wide rate limits, advisory locks, `src/lib/crypto.ts`.
- **Kept:** Better Auth, `requireAdmin()` in every admin page and action, zod validation, parameterised SQL, honeypots, four basic headers, per-visitor limits on login, contact and testimonials.
- **Do not add security layers back unless the owner asks** (`docs/SECURITY.md`).

### 4. Frontend

- Added sitemap, robots, Open Graph image, canonical and share tags, JSON-LD, two public 404 variants, a dashboard not-found and an error page.
- Testimonials section on the home page, after Work, hidden while none are published.
- Scroll reveals use CSS plus one observer instead of `motion`.
- FAQ is a native `<details>`, the mobile menu a native `<dialog>`, and contact-form validation loads on first focus. These keep JavaScript down, so don't move Base UI or zod back into the public first load.

### 5. Brand and hero

- Official logo in `public/brand/`, plus a derived light-lettering copy for dark bands.
- hello@sysvelop.com shows in the contact section, footer and form error.
- The desktop nav starts at 960px, because the wider logo broke it below that.
- The hero is a 3D ASCII "v" with an orbit: 15 fps, only while on screen, pausable, static under reduced motion, hidden below 768px. It costs about one Lighthouse point.

### 6. Testimonial link

The link origin is the first non-empty of `NEXT_PUBLIC_SITE_URL`, `VERCEL_PROJECT_PRODUCTION_URL`, `BETTER_AUTH_URL`. If that is empty or local, it uses the host the dashboard is viewed on.

---

## Files touched

Everything in `d84769b`, compared with `1c1cc55`. A = added, M = modified, D = deleted.

### Database, config and scripts

| | File | Change |
|---|---|---|
| M | `db/schema.sql` | Five new tables |
| M | `scripts/db-migrate.mjs` | One-time service seed, in a transaction |
| M | `next.config.ts` | Four basic headers, no CSP |
| A | `copy-rules.json` | Banned words for publishing |

### Admin

| | File | Change |
|---|---|---|
| D | `src/app/admin/page.tsx` | Moved into the route group |
| A | `src/app/admin/(dashboard)/page.tsx` | Enquiries, now inside the shared layout |
| A | `src/app/admin/(dashboard)/layout.tsx` | Shared sidebar shell (not an auth boundary) |
| A | `src/app/admin/(dashboard)/not-found.tsx` | Missing-item message |
| A | `src/app/admin/(dashboard)/case-studies/page.tsx` | List |
| A | `src/app/admin/(dashboard)/case-studies/[id]/page.tsx` | Create and edit |
| A | `src/app/admin/(dashboard)/services/page.tsx` | List |
| A | `src/app/admin/(dashboard)/services/[id]/page.tsx` | Create and edit |
| A | `src/app/admin/(dashboard)/testimonials/page.tsx` | Page and share-link origin |
| A | `src/app/admin/content-actions.ts` | Case study and service actions |
| A | `src/app/admin/testimonial-actions.ts` | Testimonial and link actions |
| M | `src/app/admin/actions.ts` | Simpler login rate limit |
| M | `src/app/admin/login/page.tsx` | Logo |
| M | `src/components/admin/app-sidebar.tsx` | New links, logo |
| A | `src/components/admin/content-page.tsx` | Page frame and setup notice |
| A | `src/components/admin/content-list.tsx` | Shared list |
| A | `src/components/admin/content-form.tsx` | Shared form parts |
| A | `src/components/admin/case-study-form.tsx` | Editor and image resize |
| A | `src/components/admin/service-form.tsx` | Editor |
| A | `src/components/admin/testimonials-manager.tsx` | Link, list and form |

### Library

| | File | Change |
|---|---|---|
| A | `src/lib/content.ts` | Cached and admin reads |
| A | `src/lib/content-cache.ts` | Double cache expiry |
| A | `src/lib/content-schema.ts` | Validation and copy rules |
| A | `src/lib/jpeg.ts` | Upload type and size check |
| A | `src/lib/seo.ts` | Site URL and metadata helper |
| A | `src/lib/testimonials.ts` | Testimonial reads |
| A | `src/lib/testimonial-schema.ts` | Testimonial validation |
| M | `src/lib/enquiries.ts` | Open-count query for the sidebar |
| M | `src/lib/rate-limit.ts` | Simplified |
| D | `src/lib/crypto.ts` | Merged into the rate limiter |

### Public routes and actions

| | File | Change |
|---|---|---|
| M | `src/app/layout.tsx` | Default metadata |
| M | `src/app/globals.css` | Reveals, menu, ASCII styles |
| M | `src/app/(site)/layout.tsx` | JSON-LD, reveal observer |
| M | `src/app/(site)/page.tsx` | Metadata, testimonials |
| A | `src/app/(site)/not-found.tsx` | 404 inside the site shell |
| M | `src/app/(site)/services/page.tsx` | Metadata |
| M | `src/app/(site)/services/[slug]/page.tsx` | Database content, `ensureStatic` |
| A | `src/app/not-found.tsx` | 404 for unknown URLs |
| A | `src/app/error.tsx` | Error page |
| A | `src/app/sitemap.ts` | Sitemap |
| A | `src/app/robots.ts` | Robots |
| A | `src/app/opengraph-image.tsx` | Share image |
| A | `src/app/testimonial/[token]/page.tsx` | Client form page |
| A | `src/app/work-image/[id]/route.ts` | Screenshot route |
| M | `src/app/actions/contact.ts` | Simpler rate limit |
| A | `src/app/actions/testimonial.ts` | Client submission |
| M | `src/app/favicon.ico` | **Not edited by the agent.** Replaced outside the session's edits with a 53x48 PNG of the blue "v" |

### Components

| | File | Change |
|---|---|---|
| A | `src/components/hero/ascii-scene.ts` | ASCII renderer |
| A | `src/components/hero/ascii-player.tsx` | Animation loop and pause |
| A | `src/components/hero/hero-ascii.tsx` | Hero visual |
| M | `src/components/motion/reveal.tsx` | Server-rendered primitives |
| A | `src/components/motion/reveal-observer.tsx` | Plays the reveals |
| M | `src/components/sections/hero.tsx` | ASCII visual, async Work check |
| M | `src/components/sections/engagements.tsx` | Lighter import |
| M | `src/components/sections/faq.tsx` | Native details |
| M | `src/components/sections/footer.tsx` | Database services, light logo |
| M | `src/components/sections/services.tsx` | Database services |
| A | `src/components/sections/testimonials.tsx` | Public section |
| M | `src/components/sections/ticker.tsx` | Comment wording only |
| M | `src/components/sections/work.tsx` | Database case studies, wrapping results |
| M | `src/components/shared/contact-form.tsx` | Lazy validation |
| A | `src/components/shared/contact-resolver.ts` | Lazy-loaded resolver |
| A | `src/components/shared/json-ld.tsx` | Structured data |
| M | `src/components/shared/logo.tsx` | Image logo |
| M | `src/components/shared/mobile-menu.tsx` | Native dialog |
| M | `src/components/shared/nav.tsx` | Database services, 960px breakpoint |
| M | `src/components/shared/page-hero.tsx` | Lighter import |
| A | `src/components/shared/testimonial-fields.tsx` | Shared fields |
| A | `src/components/shared/testimonial-form.tsx` | Client form |
| A | `src/components/ui/button-variants.ts` | Styles without Base UI |
| M | `src/components/ui/button.tsx` | Uses the split styles |

### Content, assets and docs

| | File | Change |
|---|---|---|
| M | `src/content/projects.ts` | Reads case studies from the database |
| M | `src/content/services.ts` | Now seed and fallback |
| M | `src/content/site.ts` | Email, SEO copy, labels |
| A | `src/content/testimonials.ts` | Proposed testimonial copy |
| A | `public/brand/logo.png` | Official logo |
| A | `public/brand/logo-light.png` | Derived light version |
| D | `public/logo.png` | Old 101x23 logo |
| M | `docs/CONTENT.md` | Dashboard exception, proposed copy, email |
| M | `docs/DESIGN.md` | Motion, hero, testimonials |
| M | `docs/PRD.md` | Scope and decisions |
| M | `docs/SECURITY.md` | Simplified |
| M | `docs/TASKS.md` | Ticks (some too generous, see below) |
| M | `docs/TRD.md` | Content architecture |
| A | `bash.exe.stackdump` | **Committed by accident.** Git Bash crash log, delete it |

---

## What failed

### Found and fixed (don't reintroduce)

| Failure | Cause | Fix |
|---|---|---|
| Saved content stayed stale for 15 minutes (14 of 24 trials) | Next.js dates a regenerated page by write time, not read time | Second expiry after 5s (0 of 24 afterwards) |
| Service pages errored after a save | Fallback-shell regeneration awaited params | `ensureStatic = "navigation"` |
| Dashboard clicks were silently dropped | A `pending` guard | Guard removed, actions are safe to repeat |
| Wrong message for a bad project URL | zod union reports the branch's error | Message on `z.url` |
| Header overflowed on tablets, twice | Work link, then the wider logo | Single 960px breakpoint |
| Long result figures split mid-word | Fixed grid columns | Wrapping flex row |
| Mobile menu links announced as buttons | Base UI `SheetClose` | Plain anchors in a native dialog |
| Safari didn't return focus to the menu button | Safari doesn't focus on tap | Focus it before `showModal()` |
| 404 rendered a second logo inside the site shell | Only a root `not-found` existed | Segment-level not-found files |
| Testimonial link showed localhost | Built from the request host only | Configured site URL first |

### Tried and rejected

- **`experimental.inlineCss`:** applied-throttle LCP improved to 1.83s, but the home score fell from about 87 to 76 and the flag is experimental.
- **`contain: strict` on each ASCII row:** no CPU gain. Lowering 20 fps to 15 worked (about 13% to 9% main thread).
- **Tighter nav spacing to fit tablets:** the button wrapped. The menu breakpoint replaced it.
- **Logo from `Untitled-1.ai`** in the owner's designs folder: it is an older logo in another typeface.

### Still failing or wrong

1. **Performance is below target:** score 88 to 92 against 95, LCP above 1.8s, JavaScript above budget.
2. **Publishing from localhost leaves the live site stale for an hour or more.** Cache expiry only affects the server that ran the action. Publish from the live dashboard.
3. **`bash.exe.stackdump` is in the repository.**
4. **`docs/TASKS.md` overstates verification.** "Test every case in QA §2" and "Full accessibility, responsive, content, and security checks" are ticked, but newline injection, 200% zoom and the deployed `/reference` check were never run.
5. **`src/app/error.tsx` probably nests `<main>`** when shown inside the site or dashboard layout, as the root 404 did. Not reproduced.
6. **No lasting regression suite.** The browser test scripts were throwaway and were deleted. `tests/home.spec.ts` only checks that an `h1` is visible.
7. **Fixed text doesn't follow services:** ticker, hero labels, contact-form options, `/services` meta description.
8. **Unpublished screenshots can stay cached** for about 4 hours.
9. **Unused code:** the `motion` dependency and `src/components/ui/accordion.tsx` have no importers.
10. **The favicon is a non-square PNG with an `.ico` name.** It builds, but a square multi-size icon would be more reliable.

### Stale docs

| Where | Says | Reality |
|---|---|---|
| `CLAUDE.md` rule 2 and working agreements | Proof and copy come only from code files | Case studies, services and testimonials come from the dashboard. Owner was asked about editing this file and hasn't answered |
| `docs/PRD.md` §7, `docs/TASKS.md` Phase 3 | No submission rate limit | 5 per 10 minutes per visitor |
| `docs/SECURITY.md` §7 | Don't store submissions, email only | Stored in Postgres, no email |
| `docs/PRD.md` §5, `docs/DESIGN.md` §3 to §8 | Dark theme, Geist, booking card | Light editorial theme, DM Sans and Space Grotesk, ASCII hero |
| `docs/PRD.md` §6 | Footer legal links | No legal pages |
| `docs/QA.md` | Booking-card checks | No booking card |
| `docs/CONTENT.md` §5 | Work reads entries in `projects.ts` | Reads published case studies |
| `docs/TRD.md` §1 and §2 | Geist, `email.ts`, `ratelimit.ts` | Outdated stack row and file tree |

---

## What to do next

### 1. Get production correct (owner, with agent help)

- [ ] Check that Vercel deployed `d84769b` successfully.
- [ ] In Vercel Production, set `NEXT_PUBLIC_SITE_URL` and `BETTER_AUTH_URL` to the live `https://` domain, then redeploy. The first is fixed at build time.
- [ ] Confirm `DATABASE_URL` and `BETTER_AUTH_SECRET` are set, and that the database is the migrated one.
- [ ] Sign in at `/admin` on the live site.
- [ ] Copy the testimonial link there and open it in a private window.
- [ ] Publish a test service, confirm it appears, delete it, confirm it goes. This is the untested Vercel cache path.
- [ ] Send one contact enquiry and a test email to hello@sysvelop.com. An older business card shows info@sysvelop.com, so confirm which is right.
- [ ] Confirm `/reference/<file>` returns 404.
- [ ] Run PageSpeed on the live URL.

### 2. Quick cleanup (agent)

- [ ] `git rm bash.exe.stackdump` and add `*.stackdump` to `.gitignore`.
- [ ] Correct the two overstated ticks in `docs/TASKS.md`, or run the missing checks.
- [ ] Fix the stale docs above. Get approval before editing `CLAUDE.md`.
- [ ] Reproduce and fix the error-page landmark.
- [ ] Remove the unused dependency and component.

### 3. Waiting on the owner (ask, don't guess)

- [ ] Approve testimonial copy: "In our clients' words.", "Share your experience." and the consent line.
- [ ] Approve the other proposed copy. Find it with `grep -rn "TODO(owner)" src`.
- [ ] Confirm the technologies list contains only tools Sysvelop uses.
- [ ] Supply proof numbers with sources. The strip stays hidden until then.
- [ ] Supply real case studies and testimonials. Never invent them.
- [ ] Supply social links, and an SVG logo if one exists.
- [ ] Decide on Vercel Analytics and Speed Insights.
- [ ] Decide on individual case study pages at `/work/[slug]`.
- [ ] Decide whether the ticker and contact options should follow services.
- [ ] Decide whether the QA loop in `docs/QA.md` becomes pre-launch only.

### 4. After that (agent)

- [ ] If the live score is under 95, work on LCP first (render-blocking CSS, font preloads), then JavaScript.
- [ ] Add a small permanent Playwright suite against a disposable database: publish to visible for all three content types, signed-out admin redirect, contact form.

---

## Working notes

### How the owner wants work done

- Speed of development matters. Default to typecheck, lint and a quick check of what changed. Test deeply only for auth, database or cache changes, or when asked.
- Keep security basic.
- The owner commits and pushes. Don't do either unless asked.

### Testing safely

- **Don't test writes on `localhost:3000`.** It writes to Neon. Use a throwaway Postgres: `docker run -d --rm -p 127.0.0.1:55439:5432 -e POSTGRES_PASSWORD=test postgres:17-alpine`.
- **Don't run test builds in the project root** while the owner's dev server runs. They share `.next` and load the Neon `.env`. Use `git archive` into a git-ignored `qa/` subfolder, set `turbopack.root` to the project root in that copy, and run `git init` inside it so Tailwind scans it.
- Delete those copies afterwards, because the project's `tsc` scans `qa/`.
- `next build` does not catch cache-regeneration errors. Test saves with `next start`.

### Environment quirks

- Read `node_modules/next/dist/docs/` before writing Next.js code (`AGENTS.md`). This version differs from common knowledge.
- Windows with Git Bash: leave a folder before deleting it, and set paths without a leading slash when passing URL paths as arguments, because MSYS rewrites them.
- The ECC plugin's GateGuard hook blocks first edits and destructive commands until facts are stated. It is still on. Only the owner should turn it off (`ECC_GATEGUARD=off`).
- The shadcn MCP server timed out throughout the session.
- Screenshots are in `qa/screenshots/` (git-ignored): `admin-content`, `frontend`, `hero-ascii`. The first two predate the logo.
