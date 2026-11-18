import { createFileRoute } from "@tanstack/react-router";
import { RequireAuth } from "@/components/admin/RequireAdmin";
import AdminConexoes from "@/pages/admin/Conexoes";

export const Route = createFileRoute("/admin/conexoes")({
  head: () => ({ meta: [
    { title: "Conexões WhatsApp | Configurações OK Plast" },
    { name: "description", content: "Conecte os números de WhatsApp dos vendedores OK Plast por QR Code." },
    { property: "og:title", content: "Conexões WhatsApp | Configurações OK Plast" },
    { property: "og:description", content: "Conecte os números de WhatsApp dos vendedores OK Plast por QR Code." },
    { property: "og:type", content: "website" },
    { name: "twitter:card", content: "summary" },
  ] }),
  component: () => <RequireAuth roles={["admin", "gestor", "vendedor"]}><AdminConexoes /></RequireAuth>,
});
