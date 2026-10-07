import { createFileRoute } from "@tanstack/react-router";
import { RequireAdmin } from "@/components/admin/RequireAdmin";
import AdminProdutos from "@/pages/admin/Produtos";

export const Route = createFileRoute("/admin/produtos")({
  head: () => ({ meta: [{"title": "Produtos | CRM OK Plast"}, {"name": "description", "content": "Gestão do catálogo de chapas plásticas da OK Plast."}, {"property": "og:title", "content": "Produtos | CRM OK Plast"}, {"property": "og:description", "content": "Gestão do catálogo de chapas plásticas da OK Plast."}, {"property": "og:type", "content": "website"}, {"name": "twitter:card", "content": "summary_large_image"}] }),
  component: () => (
    <RequireAdmin>
      <AdminProdutos />
    </RequireAdmin>
  ),
});
