"use client";

import * as React from "react";
import { toast } from "sonner";
import { CopyIcon, LinkIcon, PencilIcon, PlusIcon, Trash2Icon } from "lucide-react";
import {
  createLink,
  deleteTestimonial,
  saveTestimonial,
  setTestimonialPublished,
  turnOffLink,
} from "@/app/admin/testimonial-actions";
import type { Testimonial } from "@/lib/testimonials";
import { TestimonialFields, emptyTestimonial } from "@/components/shared/testimonial-fields";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

type Action = () => Promise<{ ok: boolean; message?: string }>;
type Confirm = { title: string; text: string; button: string; action: Action; done: string };

const labels = { name: "Client name", role: "Role (optional)", company: "Company (optional)", quote: "Testimonial" };
const tap = "h-11 md:h-9";

export function TestimonialsManager({ items, link, local }: { items: Testimonial[]; link: string | null; local: boolean }) {
  const [pending, startTransition] = React.useTransition();
  const [confirm, setConfirm] = React.useState<Confirm | null>(null);
  // id is null while adding.
  const [editing, setEditing] = React.useState<{ id: string | null; value: typeof emptyTestimonial } | null>(null);
  const form = React.useRef<HTMLFormElement>(null);
  const editingKey = editing ? (editing.id ?? "new") : null;

  React.useLayoutEffect(() => () => setConfirm(null), []);
  React.useEffect(() => {
    if (editingKey) form.current?.querySelector("input")?.focus();
  }, [editingKey]);

  function run(action: Action, done: string, after?: () => void) {
    startTransition(async () => {
      try {
        const result = await action();
        if (!result.ok) return void toast.error(result.message ?? "That didn't work. Check the details and try again.");
        toast.success(done);
        after?.();
      } catch {
        toast.error("Could not reach the server. Try again.");
      }
    });
  }

  async function copy() {
    try {
      await navigator.clipboard.writeText(link!);
      toast.success("Link copied");
    } catch {
      toast.error("Select the link and copy it manually.");
    }
  }

  return (
    <div className="flex flex-col gap-6" aria-busy={pending}>
      <section aria-labelledby="share-heading" className="flex flex-col gap-3 rounded-lg border bg-card p-4 sm:p-5">
        <h2 id="share-heading" className="font-medium">
          Link for clients
        </h2>
        <p className="text-sm leading-relaxed text-muted-foreground">
          Send this link to your clients. Anyone who has it can write a testimonial, which is saved below.
        </p>
        {link ? (
          <>
            <div className="flex flex-col gap-2 sm:flex-row">
              <Input readOnly aria-label="Link for clients" value={link} onFocus={(e) => e.target.select()} className={tap} />
              <Button className={tap} onClick={copy}>
                <CopyIcon />
                Copy link
              </Button>
            </div>
            {local ? (
              <p className="text-sm text-destructive">
                This is a localhost address, so clients can&apos;t open it. Open this page on your live site, or set
                NEXT_PUBLIC_SITE_URL to your domain and restart.
              </p>
            ) : null}
            <div className="flex flex-wrap gap-2">
              <Button
                variant="outline"
                className={tap}
                disabled={pending}
                onClick={() =>
                  setConfirm({
                    title: "Replace the link?",
                    text: "The current link will stop working for everyone you sent it to.",
                    button: "Replace",
                    action: createLink,
                    done: "New link created",
                  })
                }
              >
                Replace link
              </Button>
              <Button
                variant="ghost"
                className={tap}
                disabled={pending}
                onClick={() =>
                  setConfirm({
                    title: "Turn off the link?",
                    text: "Clients won't be able to send testimonials until you create a new one.",
                    button: "Turn off",
                    action: turnOffLink,
                    done: "Link turned off",
                  })
                }
              >
                Turn off
              </Button>
            </div>
          </>
        ) : (
          <Button className={`${tap} self-start`} disabled={pending} onClick={() => run(createLink, "Link created")}>
            <LinkIcon />
            Create link
          </Button>
        )}
      </section>

      {editing ? (
        <form
          ref={form}
          aria-label={editing.id ? "Edit testimonial" : "Add testimonial"}
          className="flex flex-col gap-4 rounded-lg border bg-card p-4 sm:p-5"
          onSubmit={(e) => {
            e.preventDefault();
            run(() => saveTestimonial(editing.id, editing.value), "Testimonial saved", () => setEditing(null));
          }}
        >
          <p className="text-sm text-muted-foreground">Use a real client&apos;s own words, with their permission.</p>
          <TestimonialFields labels={labels} value={editing.value} onChange={(value) => setEditing({ ...editing, value })} />
          <div className="flex gap-2">
            <Button type="submit" className={tap} disabled={pending}>
              {pending ? "Saving…" : "Save testimonial"}
            </Button>
            <Button variant="ghost" className={tap} onClick={() => setEditing(null)}>
              Cancel
            </Button>
          </div>
        </form>
      ) : (
        <Button variant="outline" className={`${tap} self-start`} onClick={() => setEditing({ id: null, value: emptyTestimonial })}>
          <PlusIcon />
          Add testimonial
        </Button>
      )}

      <p className="text-sm leading-relaxed text-muted-foreground">
        Only published testimonials appear on the home page. Read each one first, and don&apos;t publish one that names people
        at Sysvelop.
      </p>

      {items.length ? (
        <ul aria-label="Testimonials" className="divide-y rounded-lg border bg-card">
          {items.map(({ id, source, date, published, ...value }) => (
            <li key={id} className="flex flex-col gap-3 p-4">
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <p className="font-medium break-words">{value.name}</p>
                    <Badge variant={published ? "default" : "outline"}>{published ? "Published" : "Not published"}</Badge>
                    <Badge variant="secondary">{source === "client" ? "From client" : "Added by you"}</Badge>
                  </div>
                  <p className="mt-1 text-sm break-words text-muted-foreground">
                    {[value.role, value.company, date].filter(Boolean).join(" · ")}
                  </p>
                </div>
                <div className="flex shrink-0">
                  {source === "manual" ? (
                    <Button
                      variant="ghost"
                      size="icon"
                      className="size-11 md:size-9"
                      aria-label={`Edit testimonial from ${value.name}`}
                      onClick={() => setEditing({ id, value })}
                    >
                      <PencilIcon />
                    </Button>
                  ) : null}
                  <Button
                    variant="ghost"
                    size="icon"
                    className="size-11 md:size-9"
                    aria-label={`Delete testimonial from ${value.name}`}
                    onClick={() =>
                      setConfirm({
                        title: "Delete this testimonial?",
                        text: `The testimonial from ${value.name} will be permanently removed.`,
                        button: "Delete",
                        action: () => deleteTestimonial(id),
                        done: "Testimonial deleted",
                      })
                    }
                  >
                    <Trash2Icon />
                  </Button>
                </div>
              </div>
              <p className="text-sm leading-relaxed break-words whitespace-pre-wrap">{value.quote}</p>
              <Button
                variant="outline"
                className={`${tap} w-28 self-start`}
                aria-label={`${published ? "Unpublish" : "Publish"} testimonial from ${value.name}`}
                onClick={() => run(() => setTestimonialPublished(id, !published), published ? "Unpublished" : "Published")}
              >
                {published ? "Unpublish" : "Publish"}
              </Button>
            </li>
          ))}
        </ul>
      ) : (
        <p className="rounded-lg border border-dashed p-8 text-center text-sm text-muted-foreground">
          No testimonials yet. Add one, or send the link to a client.
        </p>
      )}

      <AlertDialog open={confirm !== null} onOpenChange={(open) => !open && setConfirm(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{confirm?.title}</AlertDialogTitle>
            <AlertDialogDescription>{confirm?.text}</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              variant="destructive"
              onClick={() => {
                if (confirm) run(confirm.action, confirm.done);
                setConfirm(null);
              }}
            >
              {confirm?.button}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
