import { createFileRoute } from "@tanstack/react-router";
import Petg from "@/pages/chapas/Petg";

export const Route = createFileRoute("/_public/chapas/petg")({
  head: () => ({ meta: [{"title": "PETG no Rio de Janeiro | OK Plast"}, {"name": "description", "content": "Chapas inteiras de petg no Rio de Janeiro. Consulte a disponibilidade e solicite orçamento com a OK Plast."}, {"property": "og:title", "content": "PETG no Rio de Janeiro | OK Plast"}, {"property": "og:description", "content": "Chapas inteiras de petg no Rio de Janeiro. Consulte a disponibilidade e solicite orçamento com a OK Plast."}, {"property": "og:type", "content": "website"}, {"name": "twitter:card", "content": "summary_large_image"}] }),
  component: Petg,
});
