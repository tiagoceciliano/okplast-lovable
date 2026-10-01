import { createFileRoute } from "@tanstack/react-router";
import { RequireAuth } from "@/components/admin/RequireAdmin";
import AdminNegociacoes from "@/pages/admin/Negociacoes";

export const Route = createFileRoute("/admin/negociacoes")({
  component: () => (
    <RequireAuth roles={["admin","gestor","vendedor"]}>
      <AdminNegociacoes />
    </RequireAuth>
  ),
});
