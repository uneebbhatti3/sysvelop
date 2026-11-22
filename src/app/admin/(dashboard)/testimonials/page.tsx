import { headers } from "next/headers";
import { requireAdmin } from "@/lib/auth";
import { siteUrl } from "@/lib/seo";
import { getTestimonialsData } from "@/lib/testimonials";
import { ContentPage, SetupNotice } from "@/components/admin/content-page";
import { TestimonialsManager } from "@/components/admin/testimonials-manager";

export default function TestimonialsPage() {
  return (
    <ContentPage title="Testimonials">
      <Testimonials />
    </ContentPage>
  );
}

const isLocal = (origin: string) => /^https?:\/\/(localhost|127\.0\.0\.1)(:|\/|$)/.test(origin);

async function Testimonials() {
  await requireAdmin();
  const data = await getTestimonialsData();
  if (!data) return <SetupNotice />;

  // Clients need the public domain, so the configured site URL wins, even when you're working on
  // localhost. Only if that is unset or local does the domain you're viewing the dashboard on apply.
  let origin = siteUrl();
  if (isLocal(origin)) {
    const host = (await headers()).get("host") ?? "localhost:3000";
    origin = `${isLocal(`http://${host}`) ? "http" : "https"}://${host}`;
  }
  const link = data.token ? `${origin}/testimonial/${data.token}` : null;

  return <TestimonialsManager items={data.items} link={link} local={isLocal(origin)} />;
}
