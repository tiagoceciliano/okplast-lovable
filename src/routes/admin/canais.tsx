import { createFileRoute } from "@tanstack/react-router";
import { RequireAuth } from "@/components/admin/RequireAdmin";
import AdminCanais from "@/pages/admin/Canais";

export const Route = createFileRoute("/admin/canais")({
  head: () => ({ meta: [
    { title: "Canais | Configurações OK Plast" },
    { name: "description", content: "Canais de atendimento WhatsApp da OK Plast: QR Code, API oficial e modelos." },
    { property: "og:title", content: "Canais | Configurações OK Plast" },
    { property: "og:description", content: "Canais de atendimento WhatsApp da OK Plast: QR Code, API oficial e modelos." },
    { property: "og:type", content: "website" },
    { name: "twitter:card", content: "summary" },
  ] }),
  component: () => <RequireAuth roles={["admin", "gestor", "vendedor"]}><AdminCanais /></RequireAuth>,
});
