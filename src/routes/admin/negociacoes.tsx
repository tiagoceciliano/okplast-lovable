import { createFileRoute } from "@tanstack/react-router";
import { RequireAuth } from "@/components/admin/RequireAdmin";
import AdminNegociacoes from "@/pages/admin/Negociacoes";

export const Route = createFileRoute("/admin/negociacoes")({
  head: () => ({
    meta: [
      { title: "Funil de vendas — OK Plast" },
      { name: "description", content: "Funil comercial, tarefas e conversas da equipe OK Plast." },
      { property: "og:title", content: "Funil de vendas — OK Plast" },
      { property: "og:description", content: "Funil comercial, tarefas e conversas da equipe OK Plast." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: () => (
    <RequireAuth roles={["admin","gestor","vendedor"]}>
      <AdminNegociacoes />
    </RequireAuth>
  ),
});
