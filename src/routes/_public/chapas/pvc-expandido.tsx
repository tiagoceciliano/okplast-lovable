import { createFileRoute } from "@tanstack/react-router";
import PvcExpandido from "@/pages/chapas/PvcExpandido";

export const Route = createFileRoute("/_public/chapas/pvc-expandido")({
  head: () => ({ meta: [{"title": "PVC Expandido no Rio de Janeiro | OK Plast"}, {"name": "description", "content": "Chapas inteiras de pvc expandido no Rio de Janeiro. Consulte a disponibilidade e solicite orçamento com a OK Plast."}, {"property": "og:title", "content": "PVC Expandido no Rio de Janeiro | OK Plast"}, {"property": "og:description", "content": "Chapas inteiras de pvc expandido no Rio de Janeiro. Consulte a disponibilidade e solicite orçamento com a OK Plast."}, {"property": "og:type", "content": "website"}, {"name": "twitter:card", "content": "summary_large_image"}] }),
  component: PvcExpandido,
});
