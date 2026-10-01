import { createFileRoute } from "@tanstack/react-router";
import { RequireAdmin } from "@/components/admin/RequireAdmin";
import AdminVendedores from "@/pages/admin/Vendedores";

export const Route = createFileRoute("/admin/vendedores")({
  head: () => ({ meta: [
    { title: "Membros | Configurações OK Plast" },
    { name: "description", content: "Gerenciamento de membros e permissões da OK Plast." },
    { property: "og:title", content: "Membros | Configurações OK Plast" },
    { property: "og:description", content: "Gerenciamento de membros e permissões da OK Plast." },
    { property: "og:type", content: "website" },
    { name: "twitter:card", content: "summary" },
  ] }),
  component: () => (
    <RequireAdmin>
      <AdminVendedores />
    </RequireAdmin>
  ),
});
