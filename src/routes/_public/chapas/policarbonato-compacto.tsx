import { createFileRoute } from "@tanstack/react-router";
import PolicarbonatoCompacto from "@/pages/chapas/PolicarbonatoCompacto";

export const Route = createFileRoute("/_public/chapas/policarbonato-compacto")({
  head: () => ({ meta: [{"title": "Policarbonato Compacto no Rio de Janeiro | OK Plast"}, {"name": "description", "content": "Chapas inteiras de policarbonato compacto no Rio de Janeiro. Consulte a disponibilidade e solicite orçamento com a OK Plast."}, {"property": "og:title", "content": "Policarbonato Compacto no Rio de Janeiro | OK Plast"}, {"property": "og:description", "content": "Chapas inteiras de policarbonato compacto no Rio de Janeiro. Consulte a disponibilidade e solicite orçamento com a OK Plast."}, {"property": "og:type", "content": "website"}, {"name": "twitter:card", "content": "summary_large_image"}] }),
  component: PolicarbonatoCompacto,
});
