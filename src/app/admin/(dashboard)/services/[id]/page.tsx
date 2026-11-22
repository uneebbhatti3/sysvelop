import { notFound } from "next/navigation";
import { requireAdmin } from "@/lib/auth";
import { listServices } from "@/lib/content";
import { ContentPage, SetupNotice } from "@/components/admin/content-page";
import { ServiceForm } from "@/components/admin/service-form";

// `/admin/services/new` creates; any other id edits.
export default function ServiceAdminPage({ params }: PageProps<"/admin/services/[id]">) {
  return (
    <ContentPage title="Service">
      <Editor params={params} />
    </ContentPage>
  );
}

async function Editor({ params }: Pick<PageProps<"/admin/services/[id]">, "params">) {
  await requireAdmin();
  const { id } = await params;
  const rows = await listServices();
  if (!rows) return <SetupNotice />;

  const item = rows.find((r) => r.id === id);
  if (!item && id !== "new") notFound();
  const others = rows
    .filter((r) => r.id !== id)
    .map((r) => ({ slug: r.slug, name: r.data.name, published: r.published }));

  return <ServiceForm key={`${id}:${item?.version}`} item={item} others={others} />;
}
