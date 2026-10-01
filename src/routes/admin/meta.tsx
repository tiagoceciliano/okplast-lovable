import { createFileRoute } from "@tanstack/react-router";
import { RequireAuth } from "@/components/admin/RequireAdmin";
import AdminMeta from "@/pages/admin/Meta";

export const Route = createFileRoute("/admin/meta")({
  component: () => (
    <RequireAuth roles={["admin","gestor","vendedor"]}>
      <AdminMeta />
    </RequireAuth>
  ),
});
