import Link from "next/link";
import { notFoundPage } from "@/content/site";
import { buttonVariants } from "@/components/ui/button-variants";
import { Cta } from "@/components/sections/cta";

// 404 inside the site shell, for example an unpublished service.
export default function SiteNotFound() {
  return (
    <>
      <section className="container-x py-24 md:py-40">
        <p className="label text-signal-text">404</p>
        <h1 className="display mt-7 max-w-[14ch] text-[clamp(3rem,1.3rem+5.6vw,7rem)] text-balance">{notFoundPage.heading}</h1>
        <Link href="/" className={buttonVariants({ size: "pill", className: "mt-10" })}>
          {notFoundPage.link}
        </Link>
      </section>
      {/* The nav's Contact links point at this section on every page. */}
      <Cta />
    </>
  );
}
