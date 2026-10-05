import { createFileRoute } from "@tanstack/react-router";
import { RequireAuth } from "@/components/admin/RequireAdmin";
import AdminModelos from "@/pages/admin/Modelos";

export const Route = createFileRoute("/admin/modelos")({
  head: () => ({ meta: [
    { title: "Modelos de mensagem | Configurações OK Plast" },
    { name: "description", content: "Criação e aprovação de modelos do WhatsApp da OK Plast." },
    { property: "og:title", content: "Modelos de mensagem | Configurações OK Plast" },
    { property: "og:description", content: "Criação e aprovação de modelos do WhatsApp da OK Plast." },
    { property: "og:type", content: "website" },
    { name: "twitter:card", content: "summary" },
  ] }),
  component: () => <RequireAuth roles={["admin", "gestor"]}><AdminModelos /></RequireAuth>,
});
