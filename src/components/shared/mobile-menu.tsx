"use client";

import { Menu } from "lucide-react";
import { Sheet, SheetClose, SheetContent, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { buttonVariants } from "@/components/ui/button";
import { uiLabels, type NavLink } from "@/content/site";

type Group = { id: string; title: string; items: { name: string; href: string }[] };

// Base UI Dialog provides the focus trap, Escape to close, and focus return.
export function MobileMenu({
  links,
  cta,
  groups,
}: {
  links: NavLink[];
  cta: { label: string; href: string };
  groups: Group[];
}) {
  return (
    <Sheet>
      <SheetTrigger
        aria-label={uiLabels.openMenu}
        className={buttonVariants({ variant: "outline", size: "icon", className: "size-11 md:hidden" })}
      >
        <Menu className="size-5" aria-hidden="true" />
      </SheetTrigger>
      <SheetContent side="right" className="w-full overflow-y-auto border-border bg-background p-0 sm:max-w-sm">
        <SheetTitle className="sr-only">{uiLabels.menuTitle}</SheetTitle>
        <nav aria-label="Mobile" className="flex flex-col px-6 pt-20 pb-8">
          <ul className="flex flex-col">
            {links.map((l) => (
              <li key={l.href} className="border-b border-border">
                <SheetClose
                  nativeButton={false}
                  render={<a href={l.href} />}
                  className="flex h-14 w-full items-center text-lg font-medium text-foreground"
                >
                  {l.label}
                </SheetClose>
                {l.href === "/services" ? (
                  <div className="flex flex-col gap-4 pb-5">
                    {groups.map((g) => (
                      <div key={g.id}>
                        <p className="text-xs font-semibold tracking-[0.06em] text-muted-foreground uppercase">{g.title}</p>
                        <ul className="mt-1">
                          {g.items.map((s) => (
                            <li key={s.href}>
                              <SheetClose
                                nativeButton={false}
                                render={<a href={s.href} />}
                                className="flex min-h-11 w-full items-center text-[15px] text-foreground"
                              >
                                {s.name}
                              </SheetClose>
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
          <SheetClose
            nativeButton={false}
            render={<a href={cta.href} />}
            className={buttonVariants({ size: "cta", className: "mt-8 h-12 w-full" })}
          >
            {cta.label}
          </SheetClose>
        </nav>
      </SheetContent>
    </Sheet>
  );
}
