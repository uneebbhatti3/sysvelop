import { Nav } from "@/components/shared/nav";
import { Hero } from "@/components/sections/hero";
import { ProofStrip } from "@/components/sections/proof-strip";
import { WhySystem } from "@/components/sections/why-system";
import { Services } from "@/components/sections/services";
import { Work } from "@/components/sections/work";
import { Faq } from "@/components/sections/faq";
import { Cta } from "@/components/sections/cta";
import { Footer } from "@/components/sections/footer";

export default function Home() {
  return (
    <div id="top" className="flex min-h-full flex-col">
      <Nav />
      <main id="main" tabIndex={-1} className="flex-1 outline-none">
        <Hero />
        <ProofStrip />
        <WhySystem />
        <Services />
        <Work />
        <Faq />
        <Cta />
      </main>
      <Footer />
    </div>
  );
}
