import { z } from "zod";
import rules from "../../copy-rules.json";

// Dashboard-managed content. Shared by the admin forms (instant feedback) and the server
// actions (the real check). Drafts only need a name; publishing needs complete, on-rules copy.

export const contentKinds = ["case-studies", "services"] as const;
export type ContentKind = (typeof contentKinds)[number];

export const projectKinds = ["Client project", "Studio project"] as const;

export const LIMITS = {
  name: 80,
  summary: 240,
  intro: 600,
  resultValue: 24,
  resultLabel: 60,
  results: { min: 2, max: 3 }, // docs/CONTENT.md §5
  stack: 10,
  stackItem: 40,
  url: 300,
  alt: 160,
  slug: 60,
  title: 60,
  text: 240,
  included: 8,
  fit: 6,
  related: 6,
  imageBytes: 700 * 1024, // server actions accept 1 MB in total
  imageEdge: 1600,
} as const;

// Every field renders on a single line or paragraph, so control characters become spaces.
const line = (max: number) =>
  z
    .string()
    .transform((s) => s.replace(/[\u0000-\u001f\u007f]+/g, " ").trim())
    .pipe(z.string().max(max, `Use ${max} characters or fewer.`));

export const caseStudyDraft = z.object({
  name: line(LIMITS.name).pipe(z.string().min(1, "Enter a name.")),
  kind: z.enum(["", ...projectKinds]),
  summary: line(LIMITS.summary),
  results: z.array(z.object({ value: line(LIMITS.resultValue), label: line(LIMITS.resultLabel) })).max(LIMITS.results.max),
  stack: z.array(line(LIMITS.stackItem)).max(LIMITS.stack),
  // Only http(s): this becomes a public link, so javascript: and data: must never get through.
  url: line(LIMITS.url).pipe(
    z.union([
      z.literal(""),
      // The message goes here: zod reports this branch's own error, not the union's.
      z.url({
        protocol: /^https?$/,
        hostname: z.regexes.domain,
        error: "Enter a full address starting with https://",
      }),
    ]),
  ),
  imageAlt: line(LIMITS.alt),
});

export const serviceSlug = z
  .string()
  .max(LIMITS.slug, `Use ${LIMITS.slug} characters or fewer.`)
  .regex(/^[a-z0-9]+(-[a-z0-9]+)*$/, "Use lowercase letters, numbers and single hyphens.");

export const serviceDraft = z.object({
  slug: serviceSlug,
  group: z.enum(["build", "automate", "grow"], "Choose a group."),
  name: line(LIMITS.name).pipe(z.string().min(1, "Enter a name.")),
  summary: line(LIMITS.summary),
  intro: line(LIMITS.intro),
  included: z.array(z.object({ title: line(LIMITS.title), text: line(LIMITS.text) })).max(LIMITS.included),
  fit: z.array(line(LIMITS.text)).max(LIMITS.fit),
  related: z.array(serviceSlug).max(LIMITS.related, `Choose ${LIMITS.related} or fewer.`),
});

export type CaseStudyInput = z.output<typeof caseStudyDraft>;
export type ServiceInput = z.output<typeof serviceDraft>;

/** Field path ("included.0.title") to message. */
export type FieldErrors = Record<string, string>;

export function fieldErrors(error: z.ZodError): FieldErrors {
  const errors: FieldErrors = {};
  for (const issue of error.issues) errors[issue.path.join(".")] ??= issue.message;
  return errors;
}

const banned = new RegExp(`\\b(${rules.banned.map((w) => w.replace(/[ -]/g, "[\\s-]+")).join("|")})\\b`, "i");
const emoji = /(?![©®™])\p{Extended_Pictographic}|\p{Regional_Indicator}/u;

/** Why this text can't be published, if it can't. */
export function copyProblem(value: string, properNoun = "") {
  if (emoji.test(value)) return "Remove the emoji.";
  const word = (properNoun ? value.replaceAll(properNoun, "") : value).match(banned)?.[0];
  return word ? `"${word}" is not allowed in site copy.` : undefined;
}

function checker() {
  const errors: FieldErrors = {};
  const add = (path: string, message: string) => void (errors[path] ??= message);
  return {
    errors,
    add,
    /** Required text that follows the copy rules. `properNoun` is exempt from banned words. */
    copy(path: string, value: string, properNoun = "") {
      if (!value) return add(path, "Required to publish.");
      const problem = copyProblem(value, properNoun);
      if (problem) add(path, problem);
    },
    unique(path: string, values: string[]) {
      values.forEach((v, i) => {
        if (v && values.indexOf(v) !== i) add(path.replace("*", String(i)), "Already used above.");
      });
    },
  };
}

export function caseStudyPublishErrors(c: CaseStudyInput, hasImage: boolean): FieldErrors {
  const { errors, add, copy, unique } = checker();
  // A client's own name may contain a banned word, so it is exempt.
  copy("name", c.name, c.name);
  if (!c.kind) add("kind", "Say whether this is a client or a studio project.");
  copy("summary", c.summary, c.name);
  if (c.results.length < LIMITS.results.min) add("results", "Add two or three real results to publish.");
  c.results.forEach((r, i) => {
    copy(`results.${i}.value`, r.value);
    copy(`results.${i}.label`, r.label);
  });
  unique("results.*.label", c.results.map((r) => r.label));
  c.stack.forEach((s, i) => copy(`stack.${i}`, s, s));
  unique("stack.*", c.stack);
  if (hasImage) copy("imageAlt", c.imageAlt, c.name);
  return errors;
}

export function servicePublishErrors(s: ServiceInput): FieldErrors {
  const { errors, add, copy, unique } = checker();
  copy("name", s.name);
  copy("summary", s.summary);
  copy("intro", s.intro);
  if (!s.included.length) add("included", "Add at least one item to publish.");
  s.included.forEach((item, i) => {
    copy(`included.${i}.title`, item.title);
    copy(`included.${i}.text`, item.text);
  });
  unique("included.*.title", s.included.map((item) => item.title));
  if (!s.fit.length) add("fit", "Add at least one line to publish.");
  s.fit.forEach((text, i) => copy(`fit.${i}`, text));
  unique("fit.*", s.fit);
  return errors;
}
