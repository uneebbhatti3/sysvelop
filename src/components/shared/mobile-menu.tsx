"use client";

import { Menu } from "lucide-react";
import { Sheet, SheetClose, SheetContent, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { buttonVariants } from "@/components/ui/button";
import { uiLabels, type NavLink } from "@/content/site";

// Base UI Dialog provides the focus trap, Escape to close, and focus return.
export function MobileMenu({ links, cta }: { links: NavLink[]; cta: { label: string; href: string } }) {
  return (
    <Sheet>
      <SheetTrigger
        aria-label={uiLabels.openMenu}
        className={buttonVariants({ variant: "outline", size: "icon", className: "size-11 md:hidden" })}
      >
        <Menu className="size-5" aria-hidden="true" />
      </SheetTrigger>
      <SheetContent side="right" className="w-full border-border bg-background p-0 sm:max-w-sm">
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
