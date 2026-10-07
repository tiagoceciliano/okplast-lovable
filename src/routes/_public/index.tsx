import { createFileRoute } from "@tanstack/react-router";
import Index from "@/pages/Index";

export const Route = createFileRoute("/_public/")({
  head: () => ({ meta: [{"title": "OK Plast | Distribuidora de Chapas Plásticas no RJ"}, {"name": "description", "content": "Chapas inteiras de acrílico, policarbonato, PETG, PS, PVC e ACM no Rio de Janeiro. Solicite seu orçamento à OK Plast."}, {"property": "og:title", "content": "OK Plast | Distribuidora de Chapas Plásticas no RJ"}, {"property": "og:description", "content": "Chapas inteiras de acrílico, policarbonato, PETG, PS, PVC e ACM no Rio de Janeiro. Solicite seu orçamento à OK Plast."}, {"property": "og:type", "content": "website"}, {"name": "twitter:card", "content": "summary_large_image"}] }),
  component: Index,
});
