import { createFileRoute } from "@tanstack/react-router";
import TermoUso from "@/pages/TermoUso";

export const Route = createFileRoute("/_public/home/termo-de-uso")({
  component: TermoUso,
});
