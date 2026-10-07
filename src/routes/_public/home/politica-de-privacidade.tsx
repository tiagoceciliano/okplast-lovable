import { createFileRoute } from "@tanstack/react-router";
import PoliticaPrivacidade from "@/pages/PoliticaPrivacidade";

export const Route = createFileRoute("/_public/home/politica-de-privacidade")({
  head: () => ({ meta: [{"title": "Política de privacidade | OK Plast"}, {"name": "description", "content": "Informações sobre a proteção dos dados pessoais e privacidade na OK Plast."}, {"property": "og:title", "content": "Política de privacidade | OK Plast"}, {"property": "og:description", "content": "Informações sobre a proteção dos dados pessoais e privacidade na OK Plast."}, {"property": "og:type", "content": "website"}, {"name": "twitter:card", "content": "summary_large_image"}] }),
  component: PoliticaPrivacidade,
});
