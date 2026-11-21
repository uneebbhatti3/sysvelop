import { z } from "zod";
import { contactForm } from "@/content/site";

// Shared by the client form (instant feedback) and the server action (the real check).
// Limits follow docs/SECURITY.md §3.

const v = contactForm.validation;

// Strip control characters (CR/LF included) so nothing can break out of an email header.
const singleLine = (max: number, message: string) =>
  z
    .string()
    .transform((s) => s.replace(/[\u0000-\u001f\u007f]+/g, " ").trim())
    .pipe(z.string().max(max, message));

export const contactSchema = z.object({
  name: singleLine(100, v.nameTooLong).pipe(z.string().min(1, v.nameRequired)),
  email: singleLine(254, v.emailInvalid).pipe(z.email(v.emailInvalid)),
  company: singleLine(120, v.companyTooLong),
  need: z.enum(contactForm.needOptions, v.needInvalid),
  message: z
    .string()
    .transform((s) => s.replace(/[\u0000-\u0008\u000b\u000c\u000e-\u001f\u007f]/g, "").trim())
    .pipe(z.string().min(1, v.messageRequired).max(4000, v.messageTooLong)),
  // Honeypot. Real people never see or fill it.
  website: z.string().max(200).optional(),
});

export type ContactInput = z.input<typeof contactSchema>;
export type ContactData = z.output<typeof contactSchema>;

export const enquiryStatuses = ["new", "contacted", "closed"] as const;
export type EnquiryStatus = (typeof enquiryStatuses)[number];
