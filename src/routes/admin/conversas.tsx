import { createFileRoute } from "@tanstack/react-router";
import { RequireAuth } from "@/components/admin/RequireAdmin";
import AdminConversas from "@/pages/admin/Conversas";

export const Route = createFileRoute("/admin/conversas")({
  component: () => (
    <RequireAuth roles={["admin","gestor","vendedor"]}>
      <AdminConversas />
    </RequireAuth>
  ),
});
