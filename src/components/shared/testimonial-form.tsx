"use client";

import * as React from "react";
import { submitTestimonial } from "@/app/actions/testimonial";
import { testimonialForm as copy } from "@/content/testimonials";
import { buttonVariants } from "@/components/ui/button-variants";
import { TestimonialFields, emptyTestimonial } from "./testimonial-fields";

export function TestimonialForm({ token }: { token: string }) {
  const [value, setValue] = React.useState(emptyTestimonial);
  const [error, setError] = React.useState("");
  const [sent, setSent] = React.useState(false);
  const [pending, startTransition] = React.useTransition();

  function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    const consent = form.get("consent") === "on";
    const website = String(form.get("website") ?? "");
    setError("");
    startTransition(async () => {
      if (!consent) return setError(copy.errors.invalid);
      try {
        const result = await submitTestimonial({ ...value, token, consent, website });
        if (result.ok) setSent(true);
        else setError(result.reason === "inactive" ? `${copy.inactive} ${copy.inactiveHelp}` : copy.errors[result.reason]);
      } catch {
        setError(copy.errors.failed);
      }
    });
  }

  if (sent) {
    return (
      <p role="status" className="display mt-10 border-t pt-8 text-3xl">
        {copy.success}
      </p>
    );
  }

  return (
    <form onSubmit={submit} className="mt-10 flex flex-col gap-4">
      <TestimonialFields value={value} onChange={setValue} />
      <label className="flex min-h-11 items-start gap-3 py-2 text-sm leading-relaxed">
        <input type="checkbox" name="consent" required className="mt-1 size-4 shrink-0 accent-signal" />
        {copy.consent}
      </label>
      <div aria-hidden="true" className="absolute -left-[9999px] size-px overflow-hidden">
        <input name="website" tabIndex={-1} autoComplete="off" />
      </div>
      <p role="alert" className="text-sm text-destructive empty:hidden">
        {error}
      </p>
      <button type="submit" disabled={pending} className={buttonVariants({ size: "pill", className: "w-full sm:w-auto sm:self-start" })}>
        {pending ? copy.sending : copy.submit}
      </button>
    </form>
  );
}
