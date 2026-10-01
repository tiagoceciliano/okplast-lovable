import { createFileRoute } from "@tanstack/react-router";
import { RequireAdmin } from "@/components/admin/RequireAdmin";
import AdminVendedores from "@/pages/admin/Vendedores";

export const Route = createFileRoute("/admin/vendedores")({
  component: () => (
    <RequireAdmin>
      <AdminVendedores />
    </RequireAdmin>
  ),
});
