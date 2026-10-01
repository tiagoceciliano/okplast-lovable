import { createFileRoute } from "@tanstack/react-router";
import { RequireAuth } from "@/components/admin/RequireAdmin";
import AdminTags from "@/pages/admin/Tags";

export const Route = createFileRoute("/admin/tags")({
  head: () => ({ meta: [
    { title: "Tags | Configurações OK Plast" },
    { name: "description", content: "Gerenciamento de tags do atendimento OK Plast." },
    { property: "og:title", content: "Tags | Configurações OK Plast" },
    { property: "og:description", content: "Gerenciamento de tags do atendimento OK Plast." },
    { property: "og:type", content: "website" },
    { name: "twitter:card", content: "summary" },
  ] }),
  component: () => <RequireAuth roles={["admin", "gestor", "vendedor"]}><AdminTags /></RequireAuth>,
});