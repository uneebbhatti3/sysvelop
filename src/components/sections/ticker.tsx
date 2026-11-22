import { ticker } from "@/content/site";

// Scrolling discipline strip. The list is rendered twice so the loop has no gap; the copy is
// hidden from assistive tech, which gets the plain list once. Static under reduced motion.
export function Ticker() {
  const row = (hidden: boolean) => (
    <ul aria-hidden={hidden || undefined} className="flex shrink-0 items-center">
      {ticker.items.map((item, i) => (
        <li
          key={item}
          className={`display px-6 text-[clamp(2.5rem,1.6rem+3.2vw,5rem)] leading-none tracking-[-0.04em] whitespace-nowrap md:px-10 ${
            i % 2 === 1 ? "text-signal-text" : ""
          }`}
        >
          {item}
        </li>
      ))}
    </ul>
  );

  return (
    <section aria-label={ticker.label} className="ticker overflow-hidden border-y border-border py-8 md:py-12">
      <div className="ticker-track flex w-max">
        {row(false)}
        {row(true)}
      </div>
    </section>
  );
}
