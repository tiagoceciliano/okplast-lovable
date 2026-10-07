import { createFileRoute } from "@tanstack/react-router";
import AdminLogin from "@/pages/admin/AdminLogin";

export const Route = createFileRoute("/admin/login")({
  head: () => ({ meta: [{"title": "Acesso administrativo | CRM OK Plast"}, {"name": "description", "content": "Entre na área de atendimento e gestão da OK Plast."}, {"property": "og:title", "content": "Acesso administrativo | CRM OK Plast"}, {"property": "og:description", "content": "Entre na área de atendimento e gestão da OK Plast."}, {"property": "og:type", "content": "website"}, {"name": "twitter:card", "content": "summary_large_image"}] }),
  component: AdminLogin,
});
