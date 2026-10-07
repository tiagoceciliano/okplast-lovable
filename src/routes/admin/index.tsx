import { createFileRoute } from "@tanstack/react-router";
import { RequireAdmin } from "@/components/admin/RequireAdmin";
import AdminDashboard from "@/pages/admin/Dashboard";

export const Route = createFileRoute("/admin/")({
  head: () => ({ meta: [{"title": "Dashboard | CRM OK Plast"}, {"name": "description", "content": "Indicadores comerciais e acompanhamento de leads da OK Plast."}, {"property": "og:title", "content": "Dashboard | CRM OK Plast"}, {"property": "og:description", "content": "Indicadores comerciais e acompanhamento de leads da OK Plast."}, {"property": "og:type", "content": "website"}, {"name": "twitter:card", "content": "summary_large_image"}] }),
  component: () => (
    <RequireAdmin>
      <AdminDashboard />
    </RequireAdmin>
  ),
});
