import { createFileRoute } from "@tanstack/react-router";
import { RequireAuth } from "@/components/admin/RequireAdmin";
import AdminRadar from "@/pages/admin/Radar";

export const Route = createFileRoute("/admin/radar")({
  component: () => (
    <RequireAuth roles={["admin","gestor","vendedor"]}>
      <AdminRadar />
    </RequireAuth>
  ),
});
