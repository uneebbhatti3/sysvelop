"use client";

// Building blocks shared by the case study and service editors.

import * as React from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { PlusIcon, XIcon } from "lucide-react";
import type { ContentResult } from "@/app/admin/content-actions";
import type { FieldErrors } from "@/lib/content-schema";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export const controlClass =
  "w-full rounded-md border border-input bg-card px-2.5 text-base outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 aria-invalid:border-destructive md:text-sm";

/**
 * Form state. Pages are hidden rather than unmounted on navigation, so unsaved edits survive
 * a trip to another screen, and the form is reset explicitly after a save or a cancel.
 */
export function useContentForm<T extends object>({
  initial,
  backHref,
  validate,
  save,
  onReset,
}: {
  initial: T;
  backHref: string;
  validate: (values: T, published: boolean) => FieldErrors;
  save: (values: T, published: boolean) => Promise<ContentResult>;
  onReset?: () => void;
}) {
  const router = useRouter();
  const [values, setValues] = React.useState(initial);
  const [errors, setErrors] = React.useState<FieldErrors>({});
  const [message, setMessage] = React.useState("");
  const [dirty, setDirty] = React.useState(false);
  const [pending, startTransition] = React.useTransition();

  React.useEffect(() => {
    if (!dirty) return;
    const warn = (e: BeforeUnloadEvent) => e.preventDefault();
    window.addEventListener("beforeunload", warn);
    return () => window.removeEventListener("beforeunload", warn);
  }, [dirty]);

  function reset() {
    setValues(initial);
    setErrors({});
    setMessage("");
    setDirty(false);
    onReset?.();
  }

  function touch() {
    setDirty(true);
    setErrors({});
    setMessage("");
  }

  function set<K extends keyof T>(key: K, value: T[K]) {
    setValues((current) => ({ ...current, [key]: value }));
    touch();
  }

  function showErrors(found: FieldErrors, text: string, form: HTMLFormElement) {
    setErrors(found);
    setMessage(text);
    // After the error renders, take the reader to the first one.
    setTimeout(() => {
      const first = form.querySelector<HTMLElement>("[aria-invalid=true], [data-error]");
      first?.focus();
      first?.scrollIntoView({ block: "center" });
    });
  }

  function submit(published: boolean, form: HTMLFormElement) {
    if (pending) return;
    const found = validate(values, published);
    if (Object.keys(found).length) return showErrors(found, "Fix the highlighted fields.", form);

    startTransition(async () => {
      try {
        const result = await save(values, published);
        if (!result.ok) return showErrors(result.errors ?? {}, result.message, form);
        toast.success(published ? "Saved and live on the site" : "Saved as a draft");
        reset();
        router.push(backHref);
      } catch {
        showErrors({}, "Could not save. Check your connection and that you're still signed in, then try again.", form);
      }
    });
  }

  function cancel() {
    reset();
    router.push(backHref);
  }

  return { values, errors, message, pending, set, touch, submit, cancel };
}

export function FormShell({
  published,
  pending,
  message,
  onSubmit,
  onCancel,
  children,
}: {
  published: boolean;
  pending: boolean;
  message: string;
  onSubmit: (published: boolean, form: HTMLFormElement) => void;
  onCancel: () => void;
  children: React.ReactNode;
}) {
  const button = (publish: boolean, label: string, primary: boolean) => (
    <Button
      variant={primary ? "default" : "outline"}
      className="h-11 px-4 md:h-9"
      disabled={pending}
      onClick={(e) => onSubmit(publish, e.currentTarget.closest("form")!)}
    >
      {label}
    </Button>
  );

  return (
    // Enter does nothing on purpose: saving and publishing are always an explicit click.
    <form noValidate onSubmit={(e) => e.preventDefault()} className="flex max-w-3xl flex-col gap-6">
      <fieldset disabled={pending} className="flex min-w-0 flex-col gap-6">
        {children}
      </fieldset>
      <div className="sticky bottom-0 z-10 flex flex-col gap-3 border-t bg-background py-4">
        <p role="alert" className="text-sm text-destructive empty:hidden">
          {message}
        </p>
        <div className="flex flex-wrap gap-2">
          {button(true, pending ? "Saving…" : published ? "Save changes" : "Publish", true)}
          {button(false, published ? "Unpublish and save" : "Save draft", false)}
          <Button variant="ghost" className="h-11 px-4 md:h-9" disabled={pending} onClick={onCancel}>
            Cancel
          </Button>
        </div>
      </div>
    </form>
  );
}

export function Field({
  label,
  hint,
  error,
  className,
  children,
}: {
  label: string;
  hint?: string;
  error?: string;
  className?: string;
  children: (props: { id: string; "aria-invalid"?: true; "aria-describedby"?: string }) => React.ReactNode;
}) {
  // useId, because hidden (preserved) pages keep their fields in the DOM.
  const id = React.useId();
  const describedBy = [hint && `${id}-hint`, error && `${id}-error`].filter(Boolean).join(" ");

  return (
    <div className={cn("flex min-w-0 flex-col gap-2", className)}>
      <Label htmlFor={id}>{label}</Label>
      {children({ id, "aria-invalid": error ? true : undefined, "aria-describedby": describedBy || undefined })}
      {hint ? (
        <p id={`${id}-hint`} className="text-xs leading-relaxed text-muted-foreground">
          {hint}
        </p>
      ) : null}
      {error ? (
        <p id={`${id}-error`} className="text-sm text-destructive">
          {error}
        </p>
      ) : null}
    </div>
  );
}

export function TextField({
  label,
  value,
  onChange,
  max,
  hint,
  error,
  multiline = false,
  readOnly = false,
  className,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  max: number;
  hint?: string;
  error?: string;
  multiline?: boolean;
  readOnly?: boolean;
  className?: string;
}) {
  return (
    <Field label={label} hint={hint} error={error} className={className}>
      {(props) => {
        const shared = { ...props, value, readOnly, maxLength: max };
        return multiline ? (
          <textarea {...shared} rows={3} onChange={(e) => onChange(e.target.value)} className={cn(controlClass, "resize-y py-2")} />
        ) : (
          <Input {...shared} onChange={(e) => onChange(e.target.value)} className="h-11 bg-card read-only:bg-muted md:h-9" />
        );
      }}
    </Field>
  );
}

export function Panel({
  title,
  hint,
  error,
  children,
}: {
  title: string;
  hint?: string;
  error?: string;
  children: React.ReactNode;
}) {
  const id = React.useId();
  return (
    <section aria-labelledby={id} className="flex flex-col gap-4 rounded-lg border bg-card p-4 sm:p-5">
      <div className="flex flex-col gap-1">
        <h2 id={id} className="text-base font-medium">
          {title}
        </h2>
        {hint ? <p className="text-sm leading-relaxed text-muted-foreground">{hint}</p> : null}
        {error ? (
          <p data-error tabIndex={-1} className="text-sm text-destructive">
            {error}
          </p>
        ) : null}
      </div>
      {children}
    </section>
  );
}

export function Repeater<T>({
  items,
  onChange,
  blank,
  max,
  noun,
  children,
}: {
  items: T[];
  onChange: (items: T[]) => void;
  blank: T;
  max: number;
  noun: string;
  children: (item: T, update: (item: T) => void, index: number) => React.ReactNode;
}) {
  const container = React.useRef<HTMLDivElement>(null);

  return (
    <div ref={container} tabIndex={-1} className="flex flex-col gap-3 outline-none">
      {items.map((item, i) => (
        <div key={i} className="flex items-start gap-2 border-b pb-3">
          <div className="min-w-0 flex-1">{children(item, (next) => onChange(items.map((v, n) => (n === i ? next : v))), i)}</div>
          <Button
            variant="ghost"
            size="icon"
            className="mt-5 size-11 text-muted-foreground md:size-9"
            aria-label={`Remove ${noun} ${i + 1}`}
            onClick={() => {
              onChange(items.filter((_, n) => n !== i));
              container.current?.focus();
            }}
          >
            <XIcon />
          </Button>
        </div>
      ))}
      {items.length < max ? (
        <Button variant="outline" className="h-11 self-start md:h-9" onClick={() => onChange([...items, blank])}>
          <PlusIcon />
          Add {noun}
        </Button>
      ) : null}
    </div>
  );
}
