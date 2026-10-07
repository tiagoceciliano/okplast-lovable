import { createFileRoute } from "@tanstack/react-router";
import Acm from "@/pages/chapas/Acm";

export const Route = createFileRoute("/_public/chapas/acm")({
  head: () => ({ meta: [{"title": "ACM no Rio de Janeiro | OK Plast"}, {"name": "description", "content": "Chapas inteiras de acm no Rio de Janeiro. Consulte a disponibilidade e solicite orçamento com a OK Plast."}, {"property": "og:title", "content": "ACM no Rio de Janeiro | OK Plast"}, {"property": "og:description", "content": "Chapas inteiras de acm no Rio de Janeiro. Consulte a disponibilidade e solicite orçamento com a OK Plast."}, {"property": "og:type", "content": "website"}, {"name": "twitter:card", "content": "summary_large_image"}] }),
  component: Acm,
});
