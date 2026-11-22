import { services } from "@/content/site";
import { serviceHref } from "@/content/services";
import { requireAdmin } from "@/lib/auth";
import { listServices } from "@/lib/content";
import { ContentList } from "@/components/admin/content-list";
import { ContentPage, SetupNotice } from "@/components/admin/content-page";

export default function ServicesAdminPage() {
  return (
    <ContentPage title="Services">
      <ServicesAdmin />
    </ContentPage>
  );
}

async function ServicesAdmin() {
  await requireAdmin();
  const rows = await listServices();
  if (!rows) return <SetupNotice />;

  return (
    <ContentList
      kind="services"
      noun="service"
      description="Each published service gets its own page and appears in the menu, home page and footer, in this order."
      sections={services.groups.map((group) => ({
        title: group.title,
        items: rows
          .filter((r) => r.data.group === group.id)
          .map(({ id, slug, published, data }) => ({
            id,
            published,
            name: data.name,
            detail: serviceHref(slug),
            liveHref: serviceHref(slug),
          })),
      }))}
    />
  );
}
