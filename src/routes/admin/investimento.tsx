import { createFileRoute } from "@tanstack/react-router";
import { RequireAuth } from "@/components/admin/RequireAdmin";
import AdminInvestimento from "@/pages/admin/Investimento";

export const Route = createFileRoute("/admin/investimento")({
  head: () => ({ meta: [{"title": "Investimento Google Ads | CRM OK Plast"}, {"name": "description", "content": "Investimentos, conversões e custos por lead das campanhas da OK Plast."}, {"property": "og:title", "content": "Investimento Google Ads | CRM OK Plast"}, {"property": "og:description", "content": "Investimentos, conversões e custos por lead das campanhas da OK Plast."}, {"property": "og:type", "content": "website"}, {"name": "twitter:card", "content": "summary_large_image"}] }),
  component: () => (
    <RequireAuth roles={["admin", "gestor"]}>
      <AdminInvestimento />
    </RequireAuth>
  ),
});
