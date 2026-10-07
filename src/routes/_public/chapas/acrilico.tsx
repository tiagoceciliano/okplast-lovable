import { createFileRoute } from "@tanstack/react-router";
import Acrilico from "@/pages/chapas/Acrilico";

export const Route = createFileRoute("/_public/chapas/acrilico")({
  head: () => ({ meta: [{"title": "Acrílico no Rio de Janeiro | OK Plast"}, {"name": "description", "content": "Chapas inteiras de acrílico no Rio de Janeiro. Consulte a disponibilidade e solicite orçamento com a OK Plast."}, {"property": "og:title", "content": "Acrílico no Rio de Janeiro | OK Plast"}, {"property": "og:description", "content": "Chapas inteiras de acrílico no Rio de Janeiro. Consulte a disponibilidade e solicite orçamento com a OK Plast."}, {"property": "og:type", "content": "website"}, {"name": "twitter:card", "content": "summary_large_image"}] }),
  component: Acrilico,
});
