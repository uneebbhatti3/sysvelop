# Product Requirements Document: Sysvelop Website

Version 1.0 · Status: ready for build

## 1. Purpose

Build the marketing website for Sysvelop. The site must convince a small-business owner within seconds that Sysvelop builds fast, well-designed, automated digital systems, and make it easy to start a conversation.

## 2. Business context

- **Company:** Sysvelop, a software studio. The name combines "systems" and "develop".
- **Services:** web and app development, AI and automation, UI/UX design, social media marketing, SEO.
- **How services are presented (three verbs):**
  - **Build:** websites, web apps, mobile apps, UI/UX design
  - **Automate:** AI workflows, booking and scheduling automation, integrations
  - **Grow:** SEO and social media
- **Target markets:** United States, United Kingdom, United Arab Emirates, Canada. All site copy is in English.
- **Positioning:** a connected-systems studio for growing businesses. Competitors sell disconnected deliverables (a site here, an app there). Sysvelop builds the website, the booking flow, the automation, and the search visibility as one system.
- **Proof points (the two claims the site leans on):**
  1. **Speed:** the sites load fast.
  2. **Booking handling:** customers book themselves and the system handles the rest.

## 3. Audience

**Primary:** owners and managers of small and growing businesses (service providers, clinics, studios, salons, local retail and brands) in the four target markets. Non-technical, time-poor, judging within seconds whether this studio looks capable and trustworthy. They care about customers, bookings, and hours saved. They do not care about technology names.

**Not the audience:** enterprises and early-stage startups seeking MVPs. Do not write copy aimed at them (no "MVP", "scale-up", "product team", "digital transformation").

## 4. Goals and success measures

| Goal | Measure |
|---|---|
| Generate enquiries | Contact form submissions (primary conversion) |
| Prove the speed claim | Mobile Lighthouse performance ≥ 95; LCP ≤ 1.8s on a mid-range mobile profile |
| Look established | Visual quality comparable to the strongest references; no placeholder text, no broken states |
| Be found | Correct metadata, structured data, sitemap, and clean semantic HTML at launch |

## 5. Scope

**In scope (launch):**
- Single-page home with anchored sections
- Working contact form
- Privacy and Terms pages
- 404 page, sitemap, robots, Open Graph image, structured data
- Dark theme only

**Out of scope (launch):** blog, pricing page or public pricing, testimonials (until real ones exist), client logo wall, team or About-the-people page, live chat, user accounts, CMS, multi-language, light theme.

**Phase 2 candidates:** individual case-study pages at `/work/[slug]`, testimonials section, booking-calendar embed, blog.

## 6. Page and section requirements

Copy for every section is in `docs/CONTENT.md`. Visual direction is in `docs/DESIGN.md`.

### Home (`/`), sections in order

1. **Navigation:** wordmark/logo, links (Services, Work, FAQ, Contact), primary button "Start a project". Sticky, minimal, collapses to a mobile menu. Must be keyboard accessible.
2. **Hero:** eyebrow, headline (the tagline), descriptor, two buttons ("Start a project" primary, "See our work" secondary), and a code-built booking-flow visual (see DESIGN.md). The LCP element must be text, not an image.
3. **Proof strip:** two metrics from `src/content/proof.ts` (mobile load time; bookings handled automatically). Each metric renders only if its value is non-empty. If both are empty, the whole strip does not render.
4. **Why one system:** short statement plus four cards (speed, booking, automation, findability) in a bento layout.
5. **Services:** Build / Automate / Grow, each with a short line and a list of items.
6. **Work:** project cards from `src/content/projects.ts`. Each project is honestly labelled (client project or studio project) and leads with a result, not a technology list. The section hides if the data file is empty.
7. **FAQ:** accordion, five questions.
8. **Final call to action:** banner with the contact form (or a button that scrolls to it).
9. **Footer:** logo, short descriptor, nav links, contact email, legal links, copyright, oversized faded wordmark.

### Other routes
- `/privacy`, `/terms`: standard policy pages (placeholder legal text must be clearly marked for review; see Open Decisions).
- `not-found`: on-brand 404 with a link home.

## 7. Functional requirements

**Contact form**
- Fields: name (required), email (required), company (optional), what you need (select: Website, App, AI automation, SEO or social media, Not sure), message (required), hidden honeypot.
- Client and server validation with the same schema. Clear inline errors. Success and failure states. No page reload.
- Submissions are emailed to the Sysvelop inbox (see Open Decisions). Rate-limited and spam-protected per `docs/SECURITY.md`.

**Proof and projects data**
- `proof.ts` entries carry `label`, `value`, and `source` (for example a PageSpeed report URL and date). A metric without a value does not render.
- `projects.ts` entries carry `slug`, `name`, `kind` ("Client project" or "Studio project"), `summary`, `results[]` (label and value), `stack[]`, optional `url`, optional `image`.

**Navigation**
- In-page anchor scrolling with offset for the sticky header. Active-section highlighting is optional.

**SEO**
- Title, meta description, canonical, Open Graph and Twitter tags, JSON-LD `Organization` and `WebSite`, `sitemap.xml`, `robots.txt`. Exact values in `docs/CONTENT.md`.

## 8. Content rules (summary)

- Speak as "Sysvelop" or "we". Never describe the team, its size, its founders, or its internal way of working.
- No invented proof of any kind.
- Banned vocabulary and tone rules: see `CLAUDE.md`.
- Pricing is not published. Enquiries are scoped individually.

## 9. Non-functional requirements

- Performance, accessibility, and security targets: `docs/TRD.md`, `docs/SECURITY.md`, `docs/QA.md`.
- Responsive from 320px to 1536px+. Mobile-first.
- WCAG 2.2 AA for text contrast, focus visibility, keyboard operation, and reduced-motion support.

## 10. Open decisions and assumptions

These need an answer from the owner. Until answered, use the stated default and flag the item in code with a `TODO(owner):` comment.

| # | Decision | Default until answered |
|---|---|---|
| 1 | Logo files and brand colours | Place the logo in `/public/brand/`. Derive the accent colour from it. If unavailable, use the proposed palette in DESIGN.md |
| 2 | Where contact enquiries are delivered (email address and sending provider) | Resend + one inbox address supplied via environment variables |
| 3 | Production domain | Use `NEXT_PUBLIC_SITE_URL` env var; no hard-coded domain |
| 4 | Real proof numbers (PageSpeed result, bookings handled) and their sources | Strip hidden until supplied |
| 5 | Which projects appear in Work, and whether each is a client project or a studio project | Section hidden until supplied |
| 6 | Public contact email and social profile links | Footer shows only what is supplied |
| 7 | Hosting and analytics | Assumed Vercel with cookieless Vercel Analytics and Speed Insights; confirm |
| 8 | Legal text for Privacy and Terms | Generate a clearly marked draft; owner must review before launch |
| 9 | Whether to add a calendar-booking embed for discovery calls | Not at launch; contact form only |

## 11. Acceptance criteria

The launch is complete when all of the following hold:

1. Every section in §6 is built and matches `docs/CONTENT.md` verbatim.
2. Mobile Lighthouse (production build): Performance ≥ 95; Accessibility, Best Practices, SEO ≥ 95.
3. No console errors, no failed network requests, no horizontal scroll at 320px.
4. Contact form works end to end, including validation, honeypot, and rate limiting.
5. No banned words, no team or founder references, and no invented proof anywhere in the rendered site.
6. Security headers from `docs/SECURITY.md` verified on the production build.
7. All `TODO(owner):` items are either resolved or listed in a handover note.