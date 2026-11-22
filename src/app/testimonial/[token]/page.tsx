import { Suspense } from "react";
import type { Metadata } from "next";
import { testimonialForm as copy } from "@/content/testimonials";
import { isLinkActive } from "@/lib/testimonials";
import { Logo } from "@/components/shared/logo";
import { TestimonialForm } from "@/components/shared/testimonial-form";

// Private link for clients: no site menu, never indexed.
export const metadata: Metadata = {
  title: copy.metaTitle,
  description: copy.intro,
  robots: { index: false, follow: false },
};

export default function TestimonialPage({ params }: PageProps<"/testimonial/[token]">) {
  return (
    <main className="mx-auto w-full max-w-2xl px-6 py-8 md:py-16">
      <Logo />
      <Suspense fallback={<div aria-busy="true" className="min-h-96" />}>
        <Testimonial params={params} />
      </Suspense>
    </main>
  );
}

async function Testimonial({ params }: Pick<PageProps<"/testimonial/[token]">, "params">) {
  const { token } = await params;
  const active = await isLinkActive(token);

  return (
    <>
      <h1 className="display mt-12 text-[clamp(2.75rem,2rem+3.5vw,4.5rem)] text-balance">
        {active ? copy.heading : copy.inactive}
      </h1>
      <p className="mt-6 text-lg leading-relaxed text-muted-foreground">{active ? copy.intro : copy.inactiveHelp}</p>
      {active ? <TestimonialForm key={token} token={token} /> : null}
    </>
  );
}
