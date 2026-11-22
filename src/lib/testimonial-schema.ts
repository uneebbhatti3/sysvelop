import { z } from "zod";
import { testimonialLimits as max } from "@/content/testimonials";

const line = (limit: number) =>
  z
    .string()
    .transform((s) => s.replace(/[\u0000-\u001f\u007f]+/g, " ").trim())
    .pipe(z.string().max(limit));

export const testimonialSchema = z.object({
  name: line(max.name).pipe(z.string().min(1)),
  role: line(max.role),
  company: line(max.company),
  // Line breaks are kept here.
  quote: z
    .string()
    .transform((s) => s.replace(/[\u0000-\u0008\u000b-\u001f\u007f]/g, "").trim())
    .pipe(z.string().min(max.quoteMin).max(max.quote)),
});

export const submissionSchema = testimonialSchema.extend({
  token: z.string().min(1).max(64),
  consent: z.literal(true),
  website: z.string().max(200), // honeypot
});

export type TestimonialInput = z.input<typeof testimonialSchema>;
// The form sends whatever the checkbox holds; the schema insists that it is true.
export type SubmissionInput = Omit<z.input<typeof submissionSchema>, "consent"> & { consent: boolean };
