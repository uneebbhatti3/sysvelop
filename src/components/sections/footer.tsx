import Link from "next/link";
import { footer, nav, services, site } from "@/content/site";
import { serviceHref, servicesInGroup } from "@/content/services";
import { getHasWork } from "@/content/projects";
import { readServices } from "@/lib/content";
import { Logo } from "@/components/shared/logo";
import { SocialIcon } from "@/components/shared/social-icon";
import { Reveal } from "@/components/motion/reveal";

// The year is cached at render time (cacheComponents forbids new Date() in the static shell).
async function CurrentYear() {
  "use cache";
  return <>{new Date().getFullYear()}</>;
}

const linkClass =
  "inline-flex min-h-10 items-center text-[15px] text-muted-foreground transition-colors hover:text-foreground";

function Column({ title, children, className }: { title: string; children: React.ReactNode; className?: string }) {
  return (
    <div className={className}>
      <p className="label mb-4 text-signal-text">{title}</p>
      <ul className="flex flex-col">{children}</ul>
    </div>
  );
}

export async function Footer() {
  const [hasWork, list] = await Promise.all([getHasWork(), readServices()]);
  const groups = services.groups
    .map((g) => ({ ...g, items: servicesInGroup(list, g.id) }))
    .filter((g) => g.items.length > 0);
  const links = nav.links.filter((l) => !l.requiresWork || hasWork);

  return (
    <footer className="theme-ink relative overflow-hidden">
      <div className="container-x">
        <div className="border-t border-border pt-16 md:pt-20">
          <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-12 lg:gap-8">
            <div className="flex flex-col gap-3 sm:col-span-2 lg:col-span-3">
              <Logo href="/" tone="light" />
              <p className="max-w-[30ch] text-base text-muted-foreground">{footer.descriptor}</p>
              {site.contactEmail ? (
                <Link href={`mailto:${site.contactEmail}`} className="text-base text-foreground hover:text-signal-text">
                  {site.contactEmail}
                </Link>
              ) : null}
              {site.socials.length > 0 ? (
                <ul className="mt-1 flex gap-2">
                  {site.socials.map((s) => (
                    <li key={s.href}>
                      <Link
                        href={s.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label={`${site.name} on ${s.name}`}
                        className="-ml-2.5 inline-flex size-11 items-center justify-center rounded-md text-muted-foreground transition-colors hover:text-foreground"
                      >
                        <SocialIcon name={s.name} className="size-5" />
                      </Link>
                    </li>
                  ))}
                </ul>
              ) : null}
            </div>

            {groups.map((g) => (
              <Column key={g.id} title={g.title} className="lg:col-span-2">
                {g.items.map((s) => (
                  <li key={s.slug}>
                    <Link href={serviceHref(s.slug)} className={linkClass}>
                      {s.name}
                    </Link>
                  </li>
                ))}
              </Column>
            ))}

            <nav aria-label="Footer" className="grid grid-cols-2 gap-8 sm:col-span-2 lg:col-span-3 lg:grid-cols-1 lg:gap-6 lg:justify-self-end">
              <Column title={site.name}>
                {links
                  .filter((l) => l.href !== "/services")
                  .map((l) => (
                    <li key={l.href}>
                      <Link href={l.href} className={linkClass}>
                        {l.label}
                      </Link>
                    </li>
                  ))}
              </Column>
            </nav>
          </div>

          <p className="mt-14 border-t border-border pt-6 text-sm text-muted-foreground">
            © <CurrentYear /> {footer.copyright}
          </p>
        </div>
      </div>

      <Reveal
        variant="rise"
        aria-hidden
        className="wordmark-fade pointer-events-none mt-6 mb-[-0.2em] text-center text-[clamp(5rem,23vw,22rem)] leading-[0.85] font-display font-medium tracking-[-0.07em] select-none"
      >
        {footer.wordmark}
      </Reveal>
    </footer>
  );
}
