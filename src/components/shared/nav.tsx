import { buttonVariants } from "@/components/ui/button";
import { nav } from "@/content/site";
import { hasWork } from "@/content/projects";
import { Logo } from "./logo";
import { MobileMenu } from "./mobile-menu";

export function Nav() {
  const links = nav.links.filter((l) => !l.requiresWork || hasWork);

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-background">
      <div className="container-x flex h-16 items-center justify-between gap-4">
        <Logo />
        <nav aria-label="Primary" className="hidden md:block">
          <ul className="flex items-center gap-1">
            {links.map((l) => (
              <li key={l.href}>
                <a
                  href={l.href}
                  className="inline-flex h-11 items-center rounded-md px-3 text-[15px] text-muted-foreground transition-colors hover:text-foreground"
                >
                  {l.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>
        <div className="flex items-center gap-2">
          <a
            href={nav.cta.href}
            className={buttonVariants({ size: "cta", className: "hidden min-[400px]:inline-flex" })}
          >
            {nav.cta.label}
          </a>
          <MobileMenu links={links} cta={nav.cta} />
        </div>
      </div>
    </header>
  );
}
