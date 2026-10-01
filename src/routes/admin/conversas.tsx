import { createFileRoute } from "@tanstack/react-router";
import { RequireAuth } from "@/components/admin/RequireAdmin";
import AdminConversas from "@/pages/admin/Conversas";

export const Route = createFileRoute("/admin/conversas")({
  head: () => ({
    meta: [
      { title: "Conversas | CRM OK Plast" },
      { name: "description", content: "Central de atendimento comercial e conversas da OK Plast." },
      { property: "og:title", content: "Conversas | CRM OK Plast" },
      { property: "og:description", content: "Central de atendimento comercial e conversas da OK Plast." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: () => (
    <RequireAuth roles={["admin","gestor","vendedor"]}>
      <AdminConversas />
    </RequireAuth>
  ),
});
