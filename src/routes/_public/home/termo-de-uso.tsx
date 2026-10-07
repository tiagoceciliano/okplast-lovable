import { createFileRoute } from "@tanstack/react-router";
import TermoUso from "@/pages/TermoUso";

export const Route = createFileRoute("/_public/home/termo-de-uso")({
  head: () => ({ meta: [{"title": "Termo de uso | OK Plast"}, {"name": "description", "content": "Termos e condições de uso do site da OK Plast."}, {"property": "og:title", "content": "Termo de uso | OK Plast"}, {"property": "og:description", "content": "Termos e condições de uso do site da OK Plast."}, {"property": "og:type", "content": "website"}, {"name": "twitter:card", "content": "summary_large_image"}] }),
  component: TermoUso,
});
