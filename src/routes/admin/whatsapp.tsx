import { createFileRoute } from "@tanstack/react-router";
import { RequireAdmin } from "@/components/admin/RequireAdmin";
import AdminVendedores from "@/pages/admin/Vendedores";

export const Route = createFileRoute("/admin/whatsapp")({
  head: () => ({ meta: [{"title": "Números WhatsApp | CRM OK Plast"}, {"name": "description", "content": "Configuração dos números e membros de atendimento WhatsApp da OK Plast."}, {"property": "og:title", "content": "Números WhatsApp | CRM OK Plast"}, {"property": "og:description", "content": "Configuração dos números e membros de atendimento WhatsApp da OK Plast."}, {"property": "og:type", "content": "website"}, {"name": "twitter:card", "content": "summary_large_image"}] }),
  component: () => (
    <RequireAdmin>
      <AdminVendedores />
    </RequireAdmin>
  ),
});
