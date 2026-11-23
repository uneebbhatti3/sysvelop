import Link from "next/link";
import { ChevronDown } from "lucide-react";
import { nav, services } from "@/content/site";
import { serviceHref, servicePageLabels, servicesInGroup } from "@/content/services";
import { getHasWork } from "@/content/projects";
import { readServices } from "@/lib/content";
import { Logo } from "./logo";
import { MobileMenu } from "./mobile-menu";

const linkClass =
  "label inline-flex h-11 items-center gap-1 rounded-md px-3 text-foreground transition-colors hover:text-signal-text";

export async function Nav() {
  const [hasWork, list] = await Promise.all([getHasWork(), readServices()]);
  const links = nav.links.filter((l) => !l.requiresWork || hasWork);
  const groups = services.groups
    .map((g) => ({ ...g, items: servicesInGroup(list, g.id) }))
    .filter((g) => g.items.length > 0);

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-background/95 backdrop-blur-sm">
      <div className="container-x relative flex h-18 items-center justify-between gap-4">
        <Logo />
        {/* Logo, up to six links and the button need 960px. Below that, the menu (same breakpoint). */}
        <nav aria-label="Primary" className="hidden min-[960px]:block">
          <ul className="flex items-center gap-1">
            {links.map((l) =>
              l.href === "/services" ? (
                // Services dropdown: opens on hover and on keyboard focus (focus-within). CSS only.
                <li key={l.href} className="group flex h-18 items-center">
                  <Link href={l.href} className={linkClass}>
                    {l.label}
                    <ChevronDown
                      className="size-3.5 transition-transform group-hover:rotate-180 group-focus-within:rotate-180"
                      aria-hidden="true"
                    />
                  </Link>
                  <div className="invisible absolute inset-x-6 top-full pt-px opacity-0 transition-opacity duration-150 group-focus-within:visible group-focus-within:opacity-100 group-hover:visible group-hover:opacity-100 md:inset-x-10 xl:inset-x-16">
                    <div className="grid max-h-[calc(100svh-5rem)] grid-cols-3 gap-8 overflow-y-auto rounded-b-[3px] border border-t-0 border-border bg-popover p-8 shadow-[0_24px_48px_-24px_rgb(27_27_27/0.25)]">
                      {groups.map((g) => (
                        <div key={g.id}>
                          <p className="label border-b border-border pb-3 text-signal-text">
                            {g.title}
                          </p>
                          <ul className="mt-2">
                            {g.items.map((s) => (
                              <li key={s.slug}>
                                <Link
                                  href={serviceHref(s.slug)}
                                  className="flex min-h-11 items-center rounded-md px-2 -mx-2 text-[15px] text-foreground transition-colors hover:bg-tint hover:text-signal-text"
                                >
                                  {s.name}
                                </Link>
                              </li>
                            ))}
                          </ul>
                        </div>
                      ))}
                      <Link
                        href="/services"
                        className="col-span-3 -mb-2 inline-flex min-h-11 items-center text-sm font-medium text-signal-text hover:underline"
                      >
                        {servicePageLabels.allServices}
                      </Link>
                    </div>
                  </div>
                </li>
              ) : (
                <li key={l.href}>
                  <Link href={l.href} className={linkClass}>
                    {l.label}
                  </Link>
                </li>
              ),
            )}
          </ul>
        </nav>
        <div className="flex items-center gap-2">
          <Link href={nav.cta.href} className="label hidden h-11 items-center border border-foreground px-4 text-foreground transition-colors hover:bg-foreground hover:text-background min-[400px]:inline-flex">
            {nav.cta.label}
          </Link>
          <MobileMenu links={links} cta={nav.cta} groups={groups.map((g) => ({ id: g.id, title: g.title, items: g.items.map((s) => ({ name: s.name, href: serviceHref(s.slug) })) }))} />
        </div>
      </div>
    </header>
  );
}
