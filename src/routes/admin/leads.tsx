import { createFileRoute } from "@tanstack/react-router";
import { RequireAdmin } from "@/components/admin/RequireAdmin";
import AdminLeads from "@/pages/admin/Leads";

export const Route = createFileRoute("/admin/leads")({
  component: () => (
    <RequireAdmin>
      <AdminLeads />
    </RequireAdmin>
  ),
});
