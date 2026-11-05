# Content: Approved Copy

Use this copy verbatim. Store it in `src/content/`. Do not add claims, numbers, or sentences that are not here. If a section needs more copy, propose it and wait for approval.

Voice: calm, precise, plain-spoken. Short active sentences, verb early. Outcomes over technology names. Banned vocabulary is listed in `CLAUDE.md`.

Items marked **[CONFIRM]** depend on an owner decision (see `docs/PRD.md` §10).

---

## Brand

- **Name:** Sysvelop
- **Tagline / hero headline:** The digital systems behind growing businesses.
- **Descriptor:** Websites, apps, and AI automation for small businesses: fast to load, simple to book, and engineered to run without constant attention.
- **One-liner (profiles, directories):** Sysvelop designs and builds websites, apps, and AI automation that help growing businesses look established, run efficiently, and get found.
- **Short bio (social):** The digital systems behind growing businesses. Websites, apps, and AI automation.

---

## Navigation

Links: Services · Work · FAQ · Contact
Button: Start a project

---

## 1. Hero

- **Eyebrow (monospace, small caps style):** Websites · Apps · AI automation
- **Headline:** The digital systems behind growing businesses.
- **Subheading:** Websites, apps, and AI automation for small businesses: fast to load, simple to book, and engineered to run without constant attention.
- **Primary button:** Start a project
- **Secondary button:** See our work

**Hero visual (code-built booking card; illustrative, no real customer data):**

- Card label: Booking
- Rows: Tue 09:30 · Tue 10:30 · Tue 11:30 (one slot becomes selected)
- Confirmed state: Confirmed
- Follow-up line: Reminder scheduled

---

## 2. Proof strip

Renders only for metrics that have a verified value in `src/content/proof.ts`.

- **Metric 1 label:** Mobile load time
- **Metric 2 label:** Bookings handled automatically

Values and sources are supplied by the owner. Do not invent them. **[CONFIRM]**

---

## 3. Why one system

- **Eyebrow:** Why Sysvelop
- **Heading:** One connected system, not a pile of separate tools.
- **Intro:** Most businesses end up with a website here, a tool there, and a marketing plan somewhere else. Sysvelop builds them as one system.

**Cards**

1. **Fast from the first line of code.** A slow page loses the customer before they read a word. Speed is built in, then measured.
2. **Bookings that handle themselves.** Customers choose a time, the calendar updates, and confirmations send themselves.
3. **Automation for the routine work.** Follow-ups, reminders, and enquiries run in the background while you run the business.
4. **Built to be found.** Structure, speed, and on-page SEO are part of the build, not an afterthought.

---

## 4. Services

- **Eyebrow:** Services
- **Heading:** Build it. Automate it. Grow it.

**Build**
Websites, web apps, and mobile apps, designed for clarity and engineered for speed.

- Business websites
- Web applications
- Mobile apps
- UI/UX design

**Automate**
AI workflows and integrations that take repetitive work off your plate.

- Booking and scheduling automation
- Lead capture and follow-up
- AI assistants and automated replies
- Integrations between the tools you already use

**Grow**
SEO and social media that bring the right customers to what you've built.

- Technical and on-page SEO
- Social media management
- Content that supports search

---

## 5. Work

Renders only when `src/content/projects.ts` has entries. **[CONFIRM]**

- **Eyebrow:** Work
- **Heading:** Systems in use, with the numbers behind them.
- **Each card:** project name, label ("Client project" or "Studio project"), one-sentence summary, two or three result figures, stack as small tags, optional link.
- **Rule:** lead with the result. Label each project honestly.

---

## 6. FAQ

- **Eyebrow:** FAQ
- **Heading:** Questions, answered.

**What does Sysvelop build?**
Websites, web and mobile apps, and AI automation for small businesses, plus SEO and social media to help what we build get found.

**Who do you work with?**
Small and growing businesses, including service providers, clinics, studios, and local brands, across the United States, United Kingdom, UAE, and Canada.

**How does pricing work?**
Every project is scoped and quoted individually after a short conversation, so the price reflects what you actually need.

**How long does a project take?**
It depends on scope. A timeline is confirmed in your proposal before any work begins.

**What do you need from me to get started?**
A short description of your business, what you want the system to do, and any existing website or tools you use. We take it from there.

---

## 7. Final call to action

- **Heading:** Ready to build the system behind your business?
- **Text:** Tell us what you need. We'll reply with a clear plan.
- **Button:** Start a project

### Contact form

- **Heading above form:** Start a project
- **Fields:** Name · Email · Company (optional) · What do you need? · Message
- **"What do you need?" options:** Website · App · AI automation · SEO or social media · Not sure yet
- **Submit button:** Send message
- **Sending state:** Sending…
- **Success:** Thanks. Your message is in, and we'll be in touch soon.
- **Error:** Something went wrong sending your message. Please try again, or email us at {contact email}. **[CONFIRM]**
- **Validation messages:** short and specific, for example "Enter a valid email address."
- **Privacy line under form:** We use your details only to reply to your enquiry. See our Privacy Policy.

---

## 8. Footer

- **Descriptor:** The digital systems behind growing businesses.
- **Columns:** Services · Work · FAQ · Contact; Privacy · Terms
- **Contact email:** {supplied by owner} **[CONFIRM]**
- **Copyright:** © {current year} Sysvelop. All rights reserved.
- **Oversized background wordmark:** Sysvelop

---

## SEO and metadata

- **Title (home):** Sysvelop | The digital systems behind growing businesses
- **Meta description:** Sysvelop builds fast websites, apps, and AI automation for small businesses, with online booking and workflows that keep the business moving.
- **Open Graph title:** Sysvelop: The digital systems behind growing businesses
- **Open Graph description:** Websites, apps, and AI automation for small businesses: fast to load, simple to book, and engineered to run without constant attention.
- **Open Graph image:** generated with `next/og`: dark background, wordmark, tagline.
- **JSON-LD `Organization`:** name "Sysvelop"; url from `NEXT_PUBLIC_SITE_URL`; logo from `/public/brand`; description = one-liner above; `sameAs` only for profiles the owner supplies. Include no address, phone number, team, or founders unless the owner provides them.
- **JSON-LD `WebSite`:** name and url.
- **404 page:** "This page isn't here." with a link: "Back to home".
