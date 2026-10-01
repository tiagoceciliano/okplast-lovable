import { createFileRoute } from "@tanstack/react-router";
import ChapasDeAcrilico from "@/pages/products/ChapasDeAcrilico";

export const Route = createFileRoute("/_public/chapas/")({
  component: ChapasDeAcrilico,
});
