import { createFileRoute } from "@tanstack/react-router";
import PoliticaVenda from "@/pages/PoliticaVenda";

export const Route = createFileRoute("/_public/home/politica-de-venda")({
  head: () => ({ meta: [{"title": "Política de venda | OK Plast"}, {"name": "description", "content": "Condições comerciais e políticas de venda de chapas inteiras da OK Plast."}, {"property": "og:title", "content": "Política de venda | OK Plast"}, {"property": "og:description", "content": "Condições comerciais e políticas de venda de chapas inteiras da OK Plast."}, {"property": "og:type", "content": "website"}, {"name": "twitter:card", "content": "summary_large_image"}] }),
  component: PoliticaVenda,
});
