// QA loop helper (docs/QA.md §1): full-page screenshots at the four review widths,
// plus console errors, failed requests, and an axe scan.
// Usage: npm run qa:shots -- [url] [label]
// Defaults: http://localhost:3000  "home". Only point this at localhost or the owner's own URLs.
import { chromium } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";
import { mkdir } from "node:fs/promises";
import path from "node:path";

const url = process.argv[2] ?? "http://localhost:3000";
const label = (process.argv[3] ?? "home").replace(/[^a-z0-9-]/gi, "-");
const widths = [375, 768, 1280, 1536];
const outDir = path.resolve("qa/screenshots");
await mkdir(outDir, { recursive: true });

const browser = await chromium.launch();
const problems = [];

for (const width of widths) {
  const context = await browser.newContext({ viewport: { width, height: 900 } });
  const page = await context.newPage();
  page.on("console", (msg) => {
    if (msg.type() === "error") problems.push(`[${width}] console error: ${msg.text()}`);
  });
  page.on("pageerror", (err) => problems.push(`[${width}] page error: ${err.message}`));
  page.on("requestfailed", (req) =>
    problems.push(`[${width}] request failed: ${req.url()} (${req.failure()?.errorText})`),
  );
  page.on("response", (res) => {
    if (res.status() >= 400) problems.push(`[${width}] HTTP ${res.status()}: ${res.url()}`);
  });

  await page.goto(url, { waitUntil: "networkidle" });
  const overflow = await page.evaluate(
    () => document.documentElement.scrollWidth > document.documentElement.clientWidth,
  );
  if (overflow) problems.push(`[${width}] horizontal overflow`);

  // Scroll through once so every scroll reveal fires, then let the last ones settle.
  await page.evaluate(async () => {
    for (let y = 0; y < document.body.scrollHeight; y += window.innerHeight / 3) {
      window.scrollTo(0, y);
      await new Promise((r) => setTimeout(r, 250));
    }
    window.scrollTo(0, 0);
  });
  await page.waitForTimeout(1200);

  const file = path.join(outDir, `${label}-${width}.png`);
  await page.screenshot({ path: file, fullPage: true });
  console.log(`saved ${file}`);

  if (width === 1280) {
    const axe = await new AxeBuilder({ page }).analyze();
    for (const v of axe.violations) {
      problems.push(`axe ${v.impact}: ${v.id} (${v.nodes.length} nodes) ${v.help}`);
    }
  }
  await context.close();
}

await browser.close();
if (problems.length) {
  console.log(`\n${problems.length} problem(s):\n` + problems.join("\n"));
  process.exitCode = 1;
} else {
  console.log("\nNo console errors, failed requests, overflow, or axe violations.");
}
