import { createFileRoute } from "@tanstack/react-router";
import ChapasDeAcrilico from "@/pages/products/ChapasDeAcrilico";

export const Route = createFileRoute("/_public/chapas/")({
  head: () => ({ meta: [{"title": "Chapas Plásticas no Rio de Janeiro | OK Plast"}, {"name": "description", "content": "Chapas inteiras de chapas plásticas no Rio de Janeiro. Consulte a disponibilidade e solicite orçamento com a OK Plast."}, {"property": "og:title", "content": "Chapas Plásticas no Rio de Janeiro | OK Plast"}, {"property": "og:description", "content": "Chapas inteiras de chapas plásticas no Rio de Janeiro. Consulte a disponibilidade e solicite orçamento com a OK Plast."}, {"property": "og:type", "content": "website"}, {"name": "twitter:card", "content": "summary_large_image"}] }),
  component: ChapasDeAcrilico,
});
