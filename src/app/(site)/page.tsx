import { seo } from "@/content/site";
import { pageMetadata } from "@/lib/seo";
import { Hero } from "@/components/sections/hero";
import { ProofStrip } from "@/components/sections/proof-strip";
import { Services } from "@/components/sections/services";
import { Why } from "@/components/sections/why";
import { Industries } from "@/components/sections/industries";
import { Work } from "@/components/sections/work";
import { Testimonials } from "@/components/sections/testimonials";
import { Engagements } from "@/components/sections/engagements";
import { Technologies } from "@/components/sections/technologies";
import { Ticker } from "@/components/sections/ticker";
import { Faq } from "@/components/sections/faq";
import { Cta } from "@/components/sections/cta";

export const metadata = pageMetadata({
  title: seo.title,
  description: seo.description,
  shareTitle: seo.ogTitle,
  shareDescription: seo.ogDescription,
  path: "/",
});

export default function Home() {
  return (
    <>
      <Hero />
      <ProofStrip />
      <Why />
      <Services />
      <Industries />
      <Work />
      <Testimonials />
      <Engagements />
      <Technologies />
      <Ticker />
      <Faq />
      <Cta />
    </>
  );
}
