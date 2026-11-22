"use client";

import * as React from "react";
import { Menu, X } from "lucide-react";
import { buttonVariants } from "@/components/ui/button-variants";
import { uiLabels, type NavLink } from "@/content/site";

type Group = { id: string; title: string; items: { name: string; href: string }[] };

// Native modal <dialog>: focus trap, Escape to close and focus return come from the browser.
export function MobileMenu({
  links,
  cta,
  groups,
}: {
  links: NavLink[];
  cta: { label: string; href: string };
  groups: Group[];
}) {
  const dialog = React.useRef<HTMLDialogElement>(null);
  const close = () => dialog.current?.close();

  return (
    <>
      <button
        type="button"
        aria-label={uiLabels.openMenu}
        aria-haspopup="dialog"
        onClick={(e) => {
          e.currentTarget.focus(); // Safari doesn't on tap, and closing returns focus to it
          dialog.current?.showModal();
        }}
        className={buttonVariants({ variant: "outline", size: "icon", className: "size-11 min-[960px]:hidden" })}
      >
        <Menu className="size-5" aria-hidden="true" />
      </button>
      <dialog
        ref={dialog}
        aria-label={uiLabels.menuTitle}
        // A click on the backdrop lands on the dialog itself.
        onClick={(e) => e.target === e.currentTarget && close()}
        className="menu-dialog fixed inset-y-0 right-0 left-auto m-0 h-dvh max-h-none w-full max-w-none overflow-y-auto overscroll-contain border-l border-border bg-background p-0 text-foreground backdrop:bg-black/70 sm:max-w-sm"
      >
        <button
          type="button"
          aria-label={uiLabels.closeMenu}
          onClick={close}
          className={buttonVariants({ variant: "ghost", size: "icon", className: "absolute top-3 right-4 size-11" })}
        >
          <X className="size-5" aria-hidden="true" />
        </button>
        <nav aria-label="Mobile" className="flex min-h-full flex-col px-6 pt-20 pb-8">
          <ul className="flex flex-col">
            {links.map((l) => (
              <li key={l.href} className="border-b border-border">
                <a href={l.href} onClick={close} className="flex h-14 w-full items-center text-lg font-medium text-foreground">
                  {l.label}
                </a>
                {l.href === "/services" ? (
                  <div className="flex flex-col gap-4 pb-5">
                    {groups.map((g) => (
                      <div key={g.id}>
                        <p className="text-xs font-semibold tracking-[0.06em] text-muted-foreground uppercase">{g.title}</p>
                        <ul className="mt-1">
                          {g.items.map((s) => (
                            <li key={s.href}>
                              <a href={s.href} onClick={close} className="flex min-h-11 w-full items-center text-[15px] text-foreground">
                                {s.name}
                              </a>
                            </li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>
                ) : null}
              </li>
            ))}
          </ul>
          <a href={cta.href} onClick={close} className={buttonVariants({ size: "cta", className: "mt-8 h-12 w-full" })}>
            {cta.label}
          </a>
        </nav>
      </dialog>
    </>
  );
}
