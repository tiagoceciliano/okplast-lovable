import { createFileRoute } from "@tanstack/react-router";
import { RequireAdmin } from "@/components/admin/RequireAdmin";
import AdminLeads from "@/pages/admin/Leads";

export const Route = createFileRoute("/admin/leads")({
  head: () => ({ meta: [{"title": "Leads | CRM OK Plast"}, {"name": "description", "content": "Gestão dos contatos e solicitações comerciais da OK Plast."}, {"property": "og:title", "content": "Leads | CRM OK Plast"}, {"property": "og:description", "content": "Gestão dos contatos e solicitações comerciais da OK Plast."}, {"property": "og:type", "content": "website"}, {"name": "twitter:card", "content": "summary_large_image"}] }),
  component: () => (
    <RequireAdmin>
      <AdminLeads />
    </RequireAdmin>
  ),
});
