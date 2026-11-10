import { verifiedProof } from "@/content/proof";

// Renders only verified metrics; hidden entirely when none have a value.
export function ProofStrip() {
  if (verifiedProof.length === 0) return null;

  return (
    <section aria-label="Proof" className="border-y border-border bg-surface/50">
      <dl className="container-x grid gap-8 py-10 sm:grid-cols-2">
        {verifiedProof.map((m) => (
          <div key={m.label} className="flex flex-col items-center gap-2 text-center">
            <dt className="order-2 text-[12px] tracking-[0.06em] text-muted-foreground uppercase">
              {m.source ? (
                <a href={m.source} className="underline-offset-4 hover:underline" rel="noopener noreferrer" target="_blank">
                  {m.label}
                </a>
              ) : (
                m.label
              )}
            </dt>
            <dd className="order-1 display text-5xl md:text-6xl">{m.value}</dd>
          </div>
        ))}
      </dl>
    </section>
  );
}
