import { createFileRoute } from "@tanstack/react-router";
import { RequireAdmin } from "@/components/admin/RequireAdmin";
import AdminProdutos from "@/pages/admin/Produtos";

export const Route = createFileRoute("/admin/produtos")({
  component: () => (
    <RequireAdmin>
      <AdminProdutos />
    </RequireAdmin>
  ),
});
