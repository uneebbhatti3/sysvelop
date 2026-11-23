"use client";

import * as React from "react";
import Link from "next/link";
import { toast } from "sonner";
import { ArrowDownIcon, ArrowUpIcon, ExternalLinkIcon, PencilIcon, PlusIcon, Trash2Icon } from "lucide-react";
import { deleteContent, moveContent, setPublished, type ContentResult } from "@/app/admin/content-actions";
import type { ContentKind } from "@/lib/content-schema";
import { Badge } from "@/components/ui/badge";
import { Button, buttonVariants } from "@/components/ui/button";
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

type Item = { id: string; name: string; detail: string; published: boolean; liveHref: string };
type Section = { title?: string; items: Item[] };

const iconButton = "size-11 text-muted-foreground aria-disabled:opacity-35 md:size-9";

export function ContentList({
  kind,
  noun,
  description,
  sections,
}: {
  kind: ContentKind;
  noun: string;
  description: string;
  sections: Section[];
}) {
  const [pending, startTransition] = React.useTransition();
  const [deleting, setDeleting] = React.useState<Item | null>(null);
  const base = `/admin/${kind}`;

  // Pages are hidden, not unmounted, on navigation: don't come back to an open dialog.
  React.useLayoutEffect(() => () => setDeleting(null), []);

  function run(action: () => Promise<ContentResult>, success?: string) {
    // No pending guard: Next.js queues actions and each one is safe to repeat. A guard would
    // silently drop clicks made while the list is still refreshing on a slower connection.
    startTransition(async () => {
      try {
        const result = await action();
        if (!result.ok) toast.error(result.message);
        else if (success) toast.success(success);
      } catch {
        toast.error("Could not reach the server. Try again.");
      }
    });
  }

  return (
    <div className="flex flex-col gap-6" aria-busy={pending}>
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <p className="max-w-[62ch] text-sm leading-relaxed text-muted-foreground">{description}</p>
        <Link href={`${base}/new`} className={buttonVariants({ className: "h-11 self-start px-4 md:h-9" })}>
          <PlusIcon />
          Add {noun}
        </Link>
      </div>

      {sections.map(({ title, items }) => (
        <section key={title ?? noun} aria-label={title}>
          {title ? <h2 className="label mb-2 text-signal-text">{title}</h2> : null}
          {items.length ? (
            <ul className="divide-y rounded-lg border bg-card">
              {items.map((item, i) => (
                <li key={item.id} className="flex flex-col gap-3 p-4 lg:flex-row lg:items-center lg:justify-between">
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <Link href={`${base}/${item.id}`} className="font-medium break-words hover:underline">
                        {item.name}
                      </Link>
                      <Badge variant={item.published ? "default" : "outline"}>{item.published ? "Published" : "Draft"}</Badge>
                    </div>
                    {item.detail ? <p className="mt-1 line-clamp-2 text-sm break-words text-muted-foreground">{item.detail}</p> : null}
                  </div>

                  <div className="flex shrink-0 flex-wrap items-center gap-1">
                    <Button
                      variant="outline"
                      className="h-11 w-full sm:w-24 md:h-9"
                      aria-label={`${item.published ? "Unpublish" : "Publish"} ${item.name}`}
                      onClick={() =>
                        run(() => setPublished(kind, item.id, !item.published), item.published ? "Unpublished" : "Published")
                      }
                    >
                      {item.published ? "Unpublish" : "Publish"}
                    </Button>
                    {/* aria-disabled, not disabled, so keyboard focus survives a move to either end. */}
                    <Button
                      variant="ghost"
                      size="icon"
                      className={iconButton}
                      aria-label={`Move ${item.name} up`}
                      aria-disabled={i === 0}
                      onClick={() => i > 0 && run(() => moveContent(kind, item.id, "up"))}
                    >
                      <ArrowUpIcon />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className={iconButton}
                      aria-label={`Move ${item.name} down`}
                      aria-disabled={i === items.length - 1}
                      onClick={() => i < items.length - 1 && run(() => moveContent(kind, item.id, "down"))}
                    >
                      <ArrowDownIcon />
                    </Button>
                    <Link
                      href={`${base}/${item.id}`}
                      aria-label={`Edit ${item.name}`}
                      className={buttonVariants({ variant: "ghost", size: "icon", className: iconButton })}
                    >
                      <PencilIcon />
                    </Link>
                    {item.published ? (
                      <Link
                        href={item.liveHref}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label={`View ${item.name} on the site`}
                        className={buttonVariants({ variant: "ghost", size: "icon", className: iconButton })}
                      >
                        <ExternalLinkIcon />
                      </Link>
                    ) : null}
                    <Button
                      variant="ghost"
                      size="icon"
                      className={`${iconButton} hover:text-destructive`}
                      aria-label={`Delete ${item.name}`}
                      onClick={() => setDeleting(item)}
                    >
                      <Trash2Icon />
                    </Button>
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <p className="rounded-lg border border-dashed p-8 text-center text-sm text-muted-foreground">
              Nothing here yet. Use “Add {noun}” to create one.
            </p>
          )}
        </section>
      ))}

      <AlertDialog open={deleting !== null} onOpenChange={(open) => !open && setDeleting(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete this {noun}?</AlertDialogTitle>
            <AlertDialogDescription>
              {deleting ? `“${deleting.name}” will be permanently removed. To only hide it from the site, unpublish it instead.` : null}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              variant="destructive"
              onClick={() => {
                if (deleting) run(() => deleteContent(kind, deleting.id), "Deleted");
                setDeleting(null);
              }}
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
