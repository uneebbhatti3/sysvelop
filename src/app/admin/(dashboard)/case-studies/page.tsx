import { requireAdmin } from "@/lib/auth";
import { listCaseStudies } from "@/lib/content";
import { ContentList } from "@/components/admin/content-list";
import { ContentPage, SetupNotice } from "@/components/admin/content-page";

export default function CaseStudiesPage() {
  return (
    <ContentPage title="Case studies">
      <CaseStudies />
    </ContentPage>
  );
}

async function CaseStudies() {
  await requireAdmin();
  const rows = await listCaseStudies();
  if (!rows) return <SetupNotice />;

  return (
    <ContentList
      kind="case-studies"
      noun="case study"
      description="Published case studies appear in the Work section, in this order. The section stays hidden while none are published."
      sections={[
        {
          items: rows.map(({ id, published, data }) => ({
            id,
            published,
            name: data.name,
            detail: [data.kind, data.summary].filter(Boolean).join(" · "),
            liveHref: "/#work",
          })),
        },
      ]}
    />
  );
}
