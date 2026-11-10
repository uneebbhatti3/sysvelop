"use client";

import { contactForm } from "@/content/site";
import { buttonVariants } from "@/components/ui/button";

// UI only (Phase 2). TODO(phase-3): zod schema shared with a server action, honeypot
// check, rate limiting, Resend delivery, and sending/success/error states.
// Until then, submit runs native validation and sends nothing.

const field =
  "w-full rounded-[3px] border border-input bg-transparent px-3.5 text-base text-foreground transition-colors placeholder:text-muted-foreground hover:border-foreground/40 focus-visible:border-ring";

export function ContactForm() {
  const f = contactForm.fields;

  return (
    <form
      noValidate={false}
      onSubmit={(e) => {
        e.preventDefault();
      }}
      className="flex flex-col gap-4"
    >
      <div className="grid gap-4 sm:grid-cols-2">
        <Field id="cf-name" label={f.name}>
          <input id="cf-name" name="name" required maxLength={100} autoComplete="name" className={`${field} h-12`} />
        </Field>
        <Field id="cf-email" label={f.email}>
          <input id="cf-email" name="email" type="email" required maxLength={254} autoComplete="email" className={`${field} h-12`} />
        </Field>
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <Field id="cf-company" label={f.company}>
          <input id="cf-company" name="company" maxLength={120} autoComplete="organization" className={`${field} h-12`} />
        </Field>
        <Field id="cf-need" label={f.need}>
          <select id="cf-need" name="need" required defaultValue="Not sure yet" className={`${field} h-12 appearance-none bg-[url("data:image/svg+xml,%3Csvg%20xmlns='http://www.w3.org/2000/svg'%20width='16'%20height='16'%20fill='none'%20stroke='%239aa0b4'%20stroke-width='2'%20viewBox='0%200%2024%2024'%3E%3Cpath%20d='m6%209%206%206%206-6'/%3E%3C/svg%3E")] bg-[length:16px] bg-[right_14px_center] bg-no-repeat pr-10`}>
            {contactForm.needOptions.map((o) => (
              <option key={o} value={o} className="bg-surface-raised">
                {o}
              </option>
            ))}
          </select>
        </Field>
      </div>
      <Field id="cf-message" label={f.message}>
        <textarea id="cf-message" name="message" required maxLength={4000} rows={5} className={`${field} resize-y py-3`} />
      </Field>

      {/* Honeypot: hidden from people and assistive technology. */}
      <div aria-hidden="true" className="absolute -left-[9999px] h-px w-px overflow-hidden">
        <input type="text" name="website" tabIndex={-1} autoComplete="off" defaultValue="" />
      </div>

      <button type="submit" className={buttonVariants({ size: "pill", className: "mt-2 w-full sm:w-auto sm:self-start" })}>
        {contactForm.submit}
      </button>
      <p className="text-sm leading-relaxed text-muted-foreground">
        {contactForm.privacyLine}{" "}
        <a href="/privacy" className="text-foreground underline underline-offset-4 hover:text-signal-text">
          {contactForm.privacyLinkLabel}
        </a>
        .
      </p>
    </form>
  );
}

function Field({ id, label, children }: { id: string; label: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-2">
      <label htmlFor={id} className="text-sm font-medium text-foreground/90">
        {label}
      </label>
      {children}
    </div>
  );
}
