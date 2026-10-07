import { createFileRoute } from "@tanstack/react-router";
import SobreNos from "@/pages/SobreNos";

export const Route = createFileRoute("/_public/home/sobre-nos")({
  head: () => ({ meta: [{"title": "Sobre nós | OK Plast"}, {"name": "description", "content": "Conheça a OK Plast, distribuidora de chapas plásticas no Rio de Janeiro."}, {"property": "og:title", "content": "Sobre nós | OK Plast"}, {"property": "og:description", "content": "Conheça a OK Plast, distribuidora de chapas plásticas no Rio de Janeiro."}, {"property": "og:type", "content": "website"}, {"name": "twitter:card", "content": "summary_large_image"}] }),
  component: SobreNos,
});
