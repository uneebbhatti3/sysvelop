"use client";

import * as React from "react";
import { saveCaseStudy } from "@/app/admin/content-actions";
import {
  LIMITS,
  caseStudyDraft,
  caseStudyPublishErrors,
  fieldErrors,
  projectKinds,
  type CaseStudyInput,
} from "@/lib/content-schema";
import type { CaseStudyRow } from "@/lib/content";
import { Button } from "@/components/ui/button";
import { Field, FormShell, Panel, Repeater, TextField, controlClass, useContentForm } from "./content-form";

const empty: CaseStudyInput = {
  name: "",
  kind: "",
  summary: "",
  results: [
    { value: "", label: "" },
    { value: "", label: "" },
  ],
  stack: [],
  url: "",
  imageAlt: "",
};

type ImageEdit = { file: Blob; preview: string } | "remove" | null;

export function CaseStudyForm({ item }: { item?: CaseStudyRow }) {
  const [image, setImage] = React.useState<ImageEdit>(null);
  const [imageError, setImageError] = React.useState("");
  const [reading, setReading] = React.useState(false);

  const preview =
    image === "remove" ? null : (image?.preview ?? (item?.imageId ? `/work-image/${item.imageId}` : null));

  const { values, errors, message, pending, set, touch, submit, cancel } = useContentForm<CaseStudyInput>({
    initial: item?.data ?? empty,
    backHref: "/admin/case-studies",
    onReset: () => {
      setImage(null);
      setImageError("");
    },
    validate: (input, published) => {
      const parsed = caseStudyDraft.safeParse(input);
      if (!parsed.success) return fieldErrors(parsed.error);
      return published ? caseStudyPublishErrors(parsed.data, preview !== null) : {};
    },
    save: (input, published) => {
      let upload: FormData | "remove" | null = null;
      if (image === "remove") upload = image;
      else if (image) {
        upload = new FormData();
        upload.set("image", image.file, "screenshot.jpg");
      }
      return saveCaseStudy({ id: item?.id ?? null, version: item?.version ?? 0, published }, input, upload);
    },
  });

  async function choose(file: File) {
    setImageError("");
    setReading(true);
    const result = await toJpeg(file).catch(() => null);
    setReading(false);
    if (!result) return setImageError("That file couldn't be read. Use a PNG, JPEG or WebP screenshot.");
    setImage({ file: result, preview: URL.createObjectURL(result) });
    touch();
  }

  return (
    <FormShell
      published={item?.published ?? false}
      pending={pending || reading}
      message={message}
      onSubmit={submit}
      onCancel={cancel}
    >
      <Panel title="Project">
        <TextField label="Project name" value={values.name} onChange={(v) => set("name", v)} max={LIMITS.name} error={errors.name} />
        <Field label="Type" error={errors.kind} hint="Use Client project only for work done for a real client.">
          {(props) => (
            <select
              {...props}
              value={values.kind}
              onChange={(e) => set("kind", e.target.value as CaseStudyInput["kind"])}
              className={`${controlClass} h-11 md:h-9`}
            >
              <option value="">Choose a type</option>
              {projectKinds.map((kind) => (
                <option key={kind}>{kind}</option>
              ))}
            </select>
          )}
        </Field>
        <TextField
          label="Summary"
          hint="One sentence. Lead with the result."
          multiline
          value={values.summary}
          onChange={(v) => set("summary", v)}
          max={LIMITS.summary}
          error={errors.summary}
        />
        <TextField
          label="Project link (optional)"
          hint="The full address, starting with https://"
          value={values.url}
          onChange={(v) => set("url", v)}
          max={LIMITS.url}
          error={errors.url}
        />
      </Panel>

      <Panel title="Results" hint="Two or three figures, shown large on the card. Use only real numbers you can back up." error={errors.results}>
        <Repeater items={values.results} onChange={(v) => set("results", v)} blank={{ value: "", label: "" }} max={LIMITS.results.max} noun="result">
          {(result, update, i) => (
            <div className="grid gap-3 sm:grid-cols-[10rem_1fr]">
              <TextField
                label={`Figure ${i + 1}`}
                value={result.value}
                onChange={(value) => update({ ...result, value })}
                max={LIMITS.resultValue}
                error={errors[`results.${i}.value`]}
              />
              <TextField
                label={`What figure ${i + 1} measures`}
                value={result.label}
                onChange={(label) => update({ ...result, label })}
                max={LIMITS.resultLabel}
                error={errors[`results.${i}.label`]}
              />
            </div>
          )}
        </Repeater>
      </Panel>

      <Panel title="Tech stack" hint="Optional. Shown as small tags at the bottom of the card." error={errors.stack}>
        <Repeater items={values.stack} onChange={(v) => set("stack", v)} blank="" max={LIMITS.stack} noun="tag">
          {(tag, update, i) => (
            <TextField label={`Tag ${i + 1}`} value={tag} onChange={update} max={LIMITS.stackItem} error={errors[`stack.${i}`]} />
          )}
        </Repeater>
      </Panel>

      <Panel title="Screenshot" hint="Optional. A real screenshot of the project. It is resized for the web automatically." error={errors.image}>
        {preview ? (
          // A local blob or a private draft image, neither of which next/image can optimise.
          // eslint-disable-next-line @next/next/no-img-element
          <img src={preview} alt="Screenshot preview" className="max-h-72 max-w-full self-start rounded-md border object-contain" />
        ) : null}
        <Field label={preview ? "Replace screenshot" : "Upload screenshot"} error={imageError}>
          {(props) => (
            <input
              {...props}
              type="file"
              accept="image/png,image/jpeg,image/webp"
              className="min-h-11 max-w-full text-sm file:mr-3 file:h-9 file:rounded-md file:border file:border-input file:bg-transparent file:px-3"
              onChange={(e) => {
                const file = e.target.files?.[0];
                e.target.value = ""; // so the same file can be picked again
                if (file) void choose(file);
              }}
            />
          )}
        </Field>
        {preview ? (
          <>
            <TextField
              label="Describe the screenshot"
              hint="Read aloud by screen readers. Required to publish."
              value={values.imageAlt}
              onChange={(v) => set("imageAlt", v)}
              max={LIMITS.alt}
              error={errors.imageAlt}
            />
            <Button
              variant="outline"
              className="h-11 self-start md:h-9"
              onClick={() => {
                setImage("remove");
                touch();
              }}
            >
              Remove screenshot
            </Button>
          </>
        ) : null}
      </Panel>
    </FormShell>
  );
}

/** Resize and re-encode in the browser. This also drops EXIF data such as GPS location. */
async function toJpeg(file: File): Promise<Blob | null> {
  const bitmap = await createImageBitmap(file);
  let scale = Math.min(1, LIMITS.imageEdge / Math.max(bitmap.width, bitmap.height));

  try {
    for (let attempt = 0; attempt < 6; attempt++, scale *= 0.8) {
      const canvas = document.createElement("canvas");
      canvas.width = Math.max(1, Math.round(bitmap.width * scale));
      canvas.height = Math.max(1, Math.round(bitmap.height * scale));
      const context = canvas.getContext("2d");
      if (!context) return null;
      context.fillStyle = "white"; // JPEG has no transparency
      context.fillRect(0, 0, canvas.width, canvas.height);
      context.drawImage(bitmap, 0, 0, canvas.width, canvas.height);
      const blob = await new Promise<Blob | null>((resolve) => canvas.toBlob(resolve, "image/jpeg", 0.85));
      if (blob && blob.size <= LIMITS.imageBytes) return blob;
    }
    return null;
  } finally {
    bitmap.close();
  }
}
