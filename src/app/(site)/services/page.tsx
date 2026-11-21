import type { Metadata } from "next";
import { servicePageLabels, servicesIndex } from "@/content/services";
import { PageHero } from "@/components/shared/page-hero";
import { Services } from "@/components/sections/services";
import { Engagements } from "@/components/sections/engagements";
import { Faq } from "@/components/sections/faq";
import { Cta } from "@/components/sections/cta";

export const metadata: Metadata = {
  title: servicesIndex.metaTitle,
  description: servicesIndex.metaDescription,
};

export default function ServicesPage() {
  return (
    <>
      <PageHero
        crumbs={[{ label: servicePageLabels.breadcrumbHome, href: "/" }, { label: servicePageLabels.breadcrumbServices }]}
        eyebrow={servicesIndex.eyebrow}
        title={servicesIndex.heading}
        tail={2}
        intro={servicesIndex.intro}
      />
      <Services showHeader={false} />
      <Engagements />
      <Faq />
      <Cta />
    </>
  );
}
