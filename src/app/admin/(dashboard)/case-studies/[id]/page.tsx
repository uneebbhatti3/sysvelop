import { notFound } from "next/navigation";
import { requireAdmin } from "@/lib/auth";
import { listCaseStudies } from "@/lib/content";
import { CaseStudyForm } from "@/components/admin/case-study-form";
import { ContentPage, SetupNotice } from "@/components/admin/content-page";

// `/admin/case-studies/new` creates; any other id edits.
export default function CaseStudyPage({ params }: PageProps<"/admin/case-studies/[id]">) {
  return (
    <ContentPage title="Case study">
      <Editor params={params} />
    </ContentPage>
  );
}

async function Editor({ params }: Pick<PageProps<"/admin/case-studies/[id]">, "params">) {
  await requireAdmin();
  const { id } = await params;
  const rows = await listCaseStudies();
  if (!rows) return <SetupNotice />;

  const item = rows.find((r) => r.id === id);
  if (!item && id !== "new") notFound();
  // Keyed by version, so the form starts again from what was last saved.
  return <CaseStudyForm key={`${id}:${item?.version}`} item={item} />;
}
