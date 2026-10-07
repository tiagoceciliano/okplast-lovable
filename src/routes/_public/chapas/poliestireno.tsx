import { createFileRoute } from "@tanstack/react-router";
import Poliestireno from "@/pages/chapas/Poliestireno";

export const Route = createFileRoute("/_public/chapas/poliestireno")({
  head: () => ({ meta: [{"title": "Poliestireno no Rio de Janeiro | OK Plast"}, {"name": "description", "content": "Chapas inteiras de poliestireno no Rio de Janeiro. Consulte a disponibilidade e solicite orçamento com a OK Plast."}, {"property": "og:title", "content": "Poliestireno no Rio de Janeiro | OK Plast"}, {"property": "og:description", "content": "Chapas inteiras de poliestireno no Rio de Janeiro. Consulte a disponibilidade e solicite orçamento com a OK Plast."}, {"property": "og:type", "content": "website"}, {"name": "twitter:card", "content": "summary_large_image"}] }),
  component: Poliestireno,
});
