"use client";

import * as React from "react";
import { saveService } from "@/app/admin/content-actions";
import { services } from "@/content/site";
import { LIMITS, fieldErrors, serviceDraft, servicePublishErrors, type ServiceInput } from "@/lib/content-schema";
import type { ServiceRow } from "@/lib/content";
import { Field, FormShell, Panel, Repeater, TextField, controlClass, useContentForm } from "./content-form";

const empty: ServiceInput = {
  slug: "",
  group: "build",
  name: "",
  summary: "",
  intro: "",
  included: [{ title: "", text: "" }],
  fit: [""],
  related: [],
};

const slugify = (name: string) =>
  name
    .normalize("NFKD")
    .replace(/\p{M}/gu, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, LIMITS.slug)
    .replace(/-$/, "");

export function ServiceForm({
  item,
  others,
}: {
  item?: ServiceRow;
  others: { slug: string; name: string; published: boolean }[];
}) {
  const [slugEdited, setSlugEdited] = React.useState(false);
  const initial: ServiceInput = item
    ? // Forget related services that have since been deleted; they'd be invisible but still counted.
      { ...item.data, slug: item.slug, related: item.data.related.filter((s) => others.some((o) => o.slug === s)) }
    : empty;

  const { values, errors, message, pending, set, submit, cancel } = useContentForm<ServiceInput>({
    initial,
    backHref: "/admin/services",
    onReset: () => setSlugEdited(false),
    validate: (input, published) => {
      const parsed = serviceDraft.safeParse(input);
      if (!parsed.success) return fieldErrors(parsed.error);
      return published ? servicePublishErrors(parsed.data) : {};
    },
    save: (input, published) => saveService({ id: item?.id ?? null, version: item?.version ?? 0, published }, input),
  });

  return (
    <FormShell published={item?.published ?? false} pending={pending} message={message} onSubmit={submit} onCancel={cancel}>
      <Panel title="Service">
        <TextField
          label="Service name"
          value={values.name}
          onChange={(name) => {
            set("name", name);
            if (!item && !slugEdited) set("slug", slugify(name));
          }}
          max={LIMITS.name}
          error={errors.name}
        />
        <TextField
          label="Page address"
          hint={
            item
              ? `/services/${values.slug}. Fixed after creation, so existing links keep working.`
              : `/services/${values.slug || "…"}. This can't be changed after you save.`
          }
          value={values.slug}
          readOnly={Boolean(item)}
          onChange={(slug) => {
            setSlugEdited(true);
            set("slug", slug);
          }}
          max={LIMITS.slug}
          error={errors.slug}
        />
        <Field label="Group" error={errors.group}>
          {(props) => (
            <select
              {...props}
              value={values.group}
              onChange={(e) => set("group", e.target.value as ServiceInput["group"])}
              className={`${controlClass} h-11 md:h-9`}
            >
              {services.groups.map((g) => (
                <option key={g.id} value={g.id}>
                  {g.title}
                </option>
              ))}
            </select>
          )}
        </Field>
        <TextField
          label="Summary"
          hint="One line. Used in service lists, as a heading on the page and as the search description."
          multiline
          value={values.summary}
          onChange={(v) => set("summary", v)}
          max={LIMITS.summary}
          error={errors.summary}
        />
        <TextField
          label="Introduction"
          hint="The paragraph at the top of the service page."
          multiline
          value={values.intro}
          onChange={(v) => set("intro", v)}
          max={LIMITS.intro}
          error={errors.intro}
        />
      </Panel>

      <Panel title="What's included" hint="Numbered cards. Four fit best on one row." error={errors.included}>
        <Repeater items={values.included} onChange={(v) => set("included", v)} blank={{ title: "", text: "" }} max={LIMITS.included} noun="item">
          {(entry, update, i) => (
            <div className="flex flex-col gap-3">
              <TextField
                label={`Item ${i + 1} title`}
                value={entry.title}
                onChange={(title) => update({ ...entry, title })}
                max={LIMITS.title}
                error={errors[`included.${i}.title`]}
              />
              <TextField
                label={`Item ${i + 1} description`}
                multiline
                value={entry.text}
                onChange={(text) => update({ ...entry, text })}
                max={LIMITS.text}
                error={errors[`included.${i}.text`]}
              />
            </div>
          )}
        </Repeater>
      </Panel>

      <Panel title="A good fit when" hint="Short lines describing the customer's situation." error={errors.fit}>
        <Repeater items={values.fit} onChange={(v) => set("fit", v)} blank="" max={LIMITS.fit} noun="line">
          {(text, update, i) => (
            <TextField label={`Line ${i + 1}`} value={text} onChange={update} max={LIMITS.text} error={errors[`fit.${i}`]} />
          )}
        </Repeater>
      </Panel>

      {others.length ? (
        <Panel title="Related services" hint={`Up to ${LIMITS.related}. Drafts only appear once published.`} error={errors.related}>
          <ul className="grid gap-x-4 sm:grid-cols-2">
            {others.map((other) => {
              const checked = values.related.includes(other.slug);
              return (
                <li key={other.slug}>
                  <label className="flex min-h-11 items-center gap-3 text-sm">
                    <input
                      type="checkbox"
                      className="size-4 shrink-0 accent-signal"
                      checked={checked}
                      disabled={!checked && values.related.length >= LIMITS.related}
                      onChange={() =>
                        set("related", checked ? values.related.filter((s) => s !== other.slug) : [...values.related, other.slug])
                      }
                    />
                    {other.name}
                    {other.published ? "" : " (draft)"}
                  </label>
                </li>
              );
            })}
          </ul>
        </Panel>
      ) : null}
    </FormShell>
  );
}
