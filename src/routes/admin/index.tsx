import { createFileRoute } from "@tanstack/react-router";
import { RequireAdmin } from "@/components/admin/RequireAdmin";
import AdminDashboard from "@/pages/admin/Dashboard";

export const Route = createFileRoute("/admin/")({
  component: () => (
    <RequireAdmin>
      <AdminDashboard />
    </RequireAdmin>
  ),
});
