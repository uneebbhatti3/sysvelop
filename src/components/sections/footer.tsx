import { footer, nav, site } from "@/content/site";
import { hasWork } from "@/content/projects";
import { Logo } from "@/components/shared/logo";

// The year is cached at render time (cacheComponents forbids new Date() in the static shell).
async function CurrentYear() {
  "use cache";
  return <>{new Date().getFullYear()}</>;
}

const linkClass = "inline-flex min-h-11 items-center text-[15px] text-muted-foreground transition-colors hover:text-foreground";

export function Footer() {
  const links = nav.links.filter((l) => !l.requiresWork || hasWork);

  return (
    <footer className="relative overflow-hidden border-t border-border bg-surface/40">
      <div className="container-x pt-16 md:pt-20">
        <div className="grid gap-10 md:grid-cols-12">
          <div className="flex flex-col gap-3 md:col-span-6">
            <Logo />
            <p className="max-w-[34ch] text-base text-muted-foreground">{footer.descriptor}</p>
            {site.contactEmail ? (
              <a href={`mailto:${site.contactEmail}`} className="text-base text-foreground hover:text-signal-text">
                {site.contactEmail}
              </a>
            ) : null}
          </div>
          <nav aria-label="Footer" className="grid grid-cols-2 gap-8 md:col-span-6 md:justify-items-end">
            <ul className="flex flex-col">
              {links.map((l) => (
                <li key={l.href}>
                  <a href={l.href} className={linkClass}>
                    {l.label}
                  </a>
                </li>
              ))}
            </ul>
            <ul className="flex flex-col">
              {footer.legal.map((l) => (
                <li key={l.href}>
                  <a href={l.href} className={linkClass}>
                    {l.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
        </div>

        <p className="mt-14 border-t border-border pt-6 text-sm text-muted-foreground">
          © <CurrentYear /> {footer.copyright}
        </p>
      </div>

      <div
        aria-hidden="true"
        className="wordmark-fade pointer-events-none -mb-[0.2em] mt-6 text-center text-[clamp(5rem,23vw,22rem)] leading-[0.85] font-semibold tracking-[-0.06em] select-none"
      >
        {footer.wordmark}
      </div>
    </footer>
  );
}
