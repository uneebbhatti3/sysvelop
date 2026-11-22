import type { Metadata } from "next";
import Link from "next/link";
import { notFoundPage, site } from "@/content/site";
import { Logo } from "@/components/shared/logo";
import { buttonVariants } from "@/components/ui/button-variants";

export const metadata: Metadata = { title: `${notFoundPage.heading} | ${site.name}` };

export default function NotFound() {
  return (
    <main className="container-x flex min-h-svh flex-col py-4">
      <Logo />
      <div className="my-auto py-20">
        <p className="label text-signal-text">404</p>
        <h1 className="display mt-7 max-w-[14ch] text-[clamp(3rem,1.3rem+5.6vw,7rem)] text-balance">{notFoundPage.heading}</h1>
        <Link href="/" className={buttonVariants({ size: "pill", className: "mt-10" })}>
          {notFoundPage.link}
        </Link>
      </div>
    </main>
  );
}
