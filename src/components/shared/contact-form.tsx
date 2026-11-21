"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { contactForm, site } from "@/content/site";
import { contactSchema, type ContactData, type ContactInput } from "@/lib/schema";
import { submitContact } from "@/app/actions/contact";
import { buttonVariants } from "@/components/ui/button";

const field =
  "w-full rounded-[3px] border border-input bg-transparent px-3.5 text-base text-foreground transition-colors placeholder:text-muted-foreground hover:border-foreground/40 focus-visible:border-ring aria-invalid:border-[#ff8a8a]";

type Status = "idle" | "success" | "error";

export function ContactForm() {
  const f = contactForm.fields;
  const [status, setStatus] = useState<Status>("idle");
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ContactInput, unknown, ContactData>({
    resolver: zodResolver(contactSchema),
    mode: "onTouched",
    defaultValues: { name: "", email: "", company: "", need: "Not sure yet", message: "" },
  });

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    // The honeypot is read straight from the DOM, so a bot that sets the value without
    // firing input events is still caught.
    const website = (e.currentTarget.elements.namedItem("website") as HTMLInputElement | null)?.value ?? "";
    return handleSubmit(async (data) => {
      setStatus("idle");
      try {
        const res = await submitContact({ ...data, website });
        if (res.ok) {
          reset();
          setStatus("success");
        } else setStatus("error");
      } catch {
        setStatus("error");
      }
    })(e);
  };

  if (status === "success") {
    return (
      <p role="status" className="border-t border-border pt-8 text-[clamp(1.5rem,1.2rem+1vw,2rem)] leading-snug font-medium">
        {contactForm.success}
      </p>
    );
  }

  return (
    <form noValidate onSubmit={onSubmit} className="flex flex-col gap-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <Field id="cf-name" label={f.name} error={errors.name?.message}>
          <input id="cf-name" {...register("name")} {...a11y("cf-name", errors.name)} maxLength={100} autoComplete="name" className={`${field} h-12`} />
        </Field>
        <Field id="cf-email" label={f.email} error={errors.email?.message}>
          <input id="cf-email" type="email" {...register("email")} {...a11y("cf-email", errors.email)} maxLength={254} autoComplete="email" className={`${field} h-12`} />
        </Field>
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <Field id="cf-company" label={f.company} error={errors.company?.message}>
          <input id="cf-company" {...register("company")} {...a11y("cf-company", errors.company)} maxLength={120} autoComplete="organization" className={`${field} h-12`} />
        </Field>
        <Field id="cf-need" label={f.need} error={errors.need?.message}>
          <select id="cf-need" {...register("need")} {...a11y("cf-need", errors.need)} className={`${field} h-12 appearance-none bg-[url("data:image/svg+xml,%3Csvg%20xmlns='http://www.w3.org/2000/svg'%20width='16'%20height='16'%20fill='none'%20stroke='%239aa0b4'%20stroke-width='2'%20viewBox='0%200%2024%2024'%3E%3Cpath%20d='m6%209%206%206%206-6'/%3E%3C/svg%3E")] bg-[length:16px] bg-[right_14px_center] bg-no-repeat pr-10`}>
            {contactForm.needOptions.map((o) => (
              <option key={o} value={o} className="bg-surface-raised">
                {o}
              </option>
            ))}
          </select>
        </Field>
      </div>
      <Field id="cf-message" label={f.message} error={errors.message?.message}>
        <textarea id="cf-message" {...register("message")} {...a11y("cf-message", errors.message)} maxLength={4000} rows={5} className={`${field} resize-y py-3`} />
      </Field>

      {/* Honeypot: hidden from people and assistive technology. */}
      <div aria-hidden="true" className="absolute -left-[9999px] h-px w-px overflow-hidden">
        <input type="text" name="website" tabIndex={-1} autoComplete="off" defaultValue="" />
      </div>

      <button
        type="submit"
        disabled={isSubmitting}
        aria-disabled={isSubmitting}
        className={buttonVariants({ size: "pill", className: "mt-2 w-full sm:w-auto sm:self-start" })}
      >
        {isSubmitting ? contactForm.sending : contactForm.submit}
      </button>

      <p role="alert" className="text-sm leading-relaxed text-[#ffb4b4] empty:hidden">
        {status === "error" ? (
          <>
            {contactForm.error}
            {site.contactEmail ? (
              <>
                {", "}
                {contactForm.errorEmailPrefix}{" "}
                <a href={`mailto:${site.contactEmail}`} className="underline underline-offset-4">
                  {site.contactEmail}
                </a>
              </>
            ) : null}
            .
          </>
        ) : null}
      </p>

      <p className="text-sm leading-relaxed text-muted-foreground">{contactForm.privacyLine}</p>
    </form>
  );
}

function a11y(id: string, error: unknown) {
  return error ? { "aria-invalid": true, "aria-describedby": `${id}-error` } : {};
}

function Field({ id, label, error, children }: { id: string; label: string; error?: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-2">
      <label htmlFor={id} className="text-sm font-medium text-foreground/90">
        {label}
      </label>
      {children}
      {error ? (
        <p id={`${id}-error`} className="text-sm text-[#ffb4b4]">
          {error}
        </p>
      ) : null}
    </div>
  );
}
