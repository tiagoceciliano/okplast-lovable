import { createFileRoute } from "@tanstack/react-router";
import { RequireAuth } from "@/components/admin/RequireAdmin";
import AdminInvestimento from "@/pages/admin/Investimento";

export const Route = createFileRoute("/admin/investimento")({
  component: () => (
    <RequireAuth roles={["admin", "gestor"]}>
      <AdminInvestimento />
    </RequireAuth>
  ),
});
