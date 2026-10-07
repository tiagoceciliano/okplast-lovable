import { createFileRoute } from "@tanstack/react-router";
import PolicarbonatoAlveolar from "@/pages/chapas/PolicarbonatoAlveolar";

export const Route = createFileRoute("/_public/chapas/policarbonato-alveolar")({
  head: () => ({ meta: [{"title": "Policarbonato Alveolar no Rio de Janeiro | OK Plast"}, {"name": "description", "content": "Chapas inteiras de policarbonato alveolar no Rio de Janeiro. Consulte a disponibilidade e solicite orçamento com a OK Plast."}, {"property": "og:title", "content": "Policarbonato Alveolar no Rio de Janeiro | OK Plast"}, {"property": "og:description", "content": "Chapas inteiras de policarbonato alveolar no Rio de Janeiro. Consulte a disponibilidade e solicite orçamento com a OK Plast."}, {"property": "og:type", "content": "website"}, {"name": "twitter:card", "content": "summary_large_image"}] }),
  component: PolicarbonatoAlveolar,
});
