"use client";

// The same four fields for the client form and the dashboard.

import * as React from "react";
import { testimonialForm, testimonialLimits as max } from "@/content/testimonials";
import type { TestimonialInput } from "@/lib/testimonial-schema";

export const emptyTestimonial: TestimonialInput = { name: "", role: "", company: "", quote: "" };

const control = "w-full rounded-[3px] border border-input bg-surface px-3 text-base focus-visible:border-ring";

export function TestimonialFields({
  value,
  onChange,
  labels = testimonialForm.fields,
}: {
  value: TestimonialInput;
  onChange: (value: TestimonialInput) => void;
  labels?: Record<keyof TestimonialInput, string>;
}) {
  const id = React.useId();

  const field = (key: keyof TestimonialInput) => {
    const props = {
      id: `${id}-${String(key)}`,
      value: value[key],
      required: key === "name" || key === "quote",
      maxLength: max[key],
      onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => onChange({ ...value, [key]: e.target.value }),
    };
    return (
      <div className="flex min-w-0 flex-col gap-2">
        <label htmlFor={props.id} className="text-sm font-medium">
          {labels[key]}
        </label>
        {key === "quote" ? (
          <textarea {...props} minLength={max.quoteMin} rows={6} className={`${control} resize-y py-2.5`} />
        ) : (
          <input {...props} className={`${control} h-11`} />
        )}
      </div>
    );
  };

  return (
    <>
      {field("name")}
      <div className="grid gap-4 sm:grid-cols-2">
        {field("role")}
        {field("company")}
      </div>
      {field("quote")}
    </>
  );
}
