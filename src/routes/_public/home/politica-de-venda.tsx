import { createFileRoute } from "@tanstack/react-router";
import PoliticaVenda from "@/pages/PoliticaVenda";

export const Route = createFileRoute("/_public/home/politica-de-venda")({
  component: PoliticaVenda,
});
