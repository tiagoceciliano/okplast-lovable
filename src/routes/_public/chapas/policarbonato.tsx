import { createFileRoute } from "@tanstack/react-router";
import Policarbonato from "@/pages/chapas/Policarbonato";

export const Route = createFileRoute("/_public/chapas/policarbonato")({
  head: () => ({ meta: [{"title": "Policarbonato no Rio de Janeiro | OK Plast"}, {"name": "description", "content": "Chapas inteiras de policarbonato no Rio de Janeiro. Consulte a disponibilidade e solicite orçamento com a OK Plast."}, {"property": "og:title", "content": "Policarbonato no Rio de Janeiro | OK Plast"}, {"property": "og:description", "content": "Chapas inteiras de policarbonato no Rio de Janeiro. Consulte a disponibilidade e solicite orçamento com a OK Plast."}, {"property": "og:type", "content": "website"}, {"name": "twitter:card", "content": "summary_large_image"}] }),
  component: Policarbonato,
});
