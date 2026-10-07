import { createFileRoute } from "@tanstack/react-router";
import { RequireAuth } from "@/components/admin/RequireAdmin";
import AdminMeta from "@/pages/admin/Meta";

export const Route = createFileRoute("/admin/meta")({
  head: () => ({ meta: [{"title": "Metas comerciais | CRM OK Plast"}, {"name": "description", "content": "Acompanhe as metas e os resultados comerciais da equipe OK Plast."}, {"property": "og:title", "content": "Metas comerciais | CRM OK Plast"}, {"property": "og:description", "content": "Acompanhe as metas e os resultados comerciais da equipe OK Plast."}, {"property": "og:type", "content": "website"}, {"name": "twitter:card", "content": "summary_large_image"}] }),
  component: () => (
    <RequireAuth roles={["admin","gestor","vendedor"]}>
      <AdminMeta />
    </RequireAuth>
  ),
});
