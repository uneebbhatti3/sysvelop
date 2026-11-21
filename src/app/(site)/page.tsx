import { Hero } from "@/components/sections/hero";
import { ProofStrip } from "@/components/sections/proof-strip";
import { Services } from "@/components/sections/services";
import { Why } from "@/components/sections/why";
import { Industries } from "@/components/sections/industries";
import { Work } from "@/components/sections/work";
import { Engagements } from "@/components/sections/engagements";
import { Technologies } from "@/components/sections/technologies";
import { Ticker } from "@/components/sections/ticker";
import { Faq } from "@/components/sections/faq";
import { Cta } from "@/components/sections/cta";

export default function Home() {
  return (
    <>
      <Hero />
      <ProofStrip />
      <Why />
      <Services />
      <Industries />
      <Work />
      <Engagements />
      <Technologies />
      <Ticker />
      <Faq />
      <Cta />
    </>
  );
}
