import { createFileRoute } from "@tanstack/react-router";
import { RequireAuth } from "@/components/admin/RequireAdmin";
import AdminGrupos from "@/pages/admin/Grupos";

export const Route = createFileRoute("/admin/grupos")({
  head: () => ({ meta: [
    { title: "Grupos | Configurações OK Plast" },
    { name: "description", content: "Gerenciamento de grupos da equipe OK Plast." },
    { property: "og:title", content: "Grupos | Configurações OK Plast" },
    { property: "og:description", content: "Gerenciamento de grupos da equipe OK Plast." },
    { property: "og:type", content: "website" },
    { name: "twitter:card", content: "summary" },
  ] }),
  component: () => <RequireAuth roles={["admin", "gestor"]}><AdminGrupos /></RequireAuth>,
});