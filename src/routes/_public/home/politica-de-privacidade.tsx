import { createFileRoute } from "@tanstack/react-router";
import PoliticaPrivacidade from "@/pages/PoliticaPrivacidade";

export const Route = createFileRoute("/_public/home/politica-de-privacidade")({
  component: PoliticaPrivacidade,
});
