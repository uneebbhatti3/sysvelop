# QA and Verification: How Claude Code Checks Its Own Work

Use Playwright to look at the real result. Do not assume a section is finished because the code compiles.

## 1. The loop (run after every section)

1. Start the dev server.
2. With Playwright, open `http://localhost:3000` and capture full-page and section screenshots at **375, 768, 1280, and 1536 px** widths.
3. Look at each screenshot. Compare against `docs/DESIGN.md` and the references in `/public/reference` (for quality and feel, not for copying).
4. Check for: overflow, clipped text, misalignment, inconsistent spacing, low contrast, awkward line breaks, broken states.
5. Read the browser console and network log. Zero errors and zero failed requests.
6. Run an axe accessibility scan on the page.
7. Fix what you find and repeat until clean. Then update the task list.

Report what you verified, with the screenshot paths. Do not claim success without having looked.

## 2. Interaction checks

- Nav: anchor links scroll to the right section; sticky header does not cover headings; mobile menu opens, closes, traps focus, and closes on Escape.
- FAQ accordion: opens and closes by mouse and keyboard.
- Hero ASCII visual: animates on screen, the pause control stops it, it is static with `prefers-reduced-motion` emulated, and it is hidden below 768 px.
- Contact form:
  - valid submission shows success
  - empty and invalid inputs show clear inline errors
  - filled honeypot returns a silent success and sends nothing
  - header-injection input (a newline in the name or email) is rejected or neutralised
- Keyboard-only: every control reachable in a logical order with a visible focus ring.

## 3. Content checks

- Rendered copy matches `docs/CONTENT.md` verbatim.
- No banned words or team references anywhere in `src/` or the rendered DOM:

```
grep -riE "premium|cutting-edge|state-of-the-art|innovative|seamless|solutions|passionate|world-class|leverage|best practices|end-to-end|affordable|founder|our team" src/
```

- No lorem ipsum, no "TODO" visible to users, no placeholder values showing.
- `ProofStrip` and `Work` do not render when their data is empty.
- Every `TODO(owner):` is listed in the handover note.

## 4. Performance checks (production build only)

```
npm run build && npm run start
```

- Run Lighthouse on mobile against the production server. Required: Performance ≥ 95; Accessibility, Best Practices, SEO ≥ 95.
- LCP element is the hero headline. CLS ≤ 0.05.
- Run the bundle analyzer. Report the three largest dependencies. Remove or defer anything unjustified.
- Confirm fonts load without layout shift.

## 5. Accessibility checks

- axe scan: no serious or critical violations.
- Contrast: body text and `--muted` text meet AA on both `--background` and `--surface`.
- One `h1`, logical heading order, landmarks present, skip link works.
- All images have appropriate `alt` (decorative ones empty).
- 200% text zoom does not break the layout.

## 6. Security and SEO checks

- Headers match `docs/SECURITY.md` (`curl -I` on the production build).
- `/reference/*` returns 404.
- Metadata, Open Graph image, JSON-LD, `sitemap.xml`, and `robots.txt` all resolve and validate.
- 404 page renders on an unknown route.

## 7. Responsive checks

- No horizontal scroll from 320 px to 1920 px.
- Tap targets at least 44 × 44 px on mobile.
- Hero text stays readable without overflow at 320 px.

## 8. Definition of done

All acceptance criteria in `docs/PRD.md` §11 hold, every item in the Security pre-launch checklist is ticked, and the final report lists: Lighthouse scores, the screenshots reviewed, any remaining `TODO(owner):` items, and any known limitations.
