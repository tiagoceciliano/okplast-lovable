import { createFileRoute } from "@tanstack/react-router";
import { RequireAuth } from "@/components/admin/RequireAdmin";
import AdminRadar from "@/pages/admin/Radar";

export const Route = createFileRoute("/admin/radar")({
  head: () => ({ meta: [{"title": "Radar comercial | CRM OK Plast"}, {"name": "description", "content": "Acompanhamento das oportunidades de atendimento da OK Plast."}, {"property": "og:title", "content": "Radar comercial | CRM OK Plast"}, {"property": "og:description", "content": "Acompanhamento das oportunidades de atendimento da OK Plast."}, {"property": "og:type", "content": "website"}, {"name": "twitter:card", "content": "summary_large_image"}] }),
  component: () => (
    <RequireAuth roles={["admin","gestor","vendedor"]}>
      <AdminRadar />
    </RequireAuth>
  ),
});
