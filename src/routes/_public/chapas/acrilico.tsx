import { createFileRoute } from "@tanstack/react-router";
import Acrilico from "@/pages/chapas/Acrilico";

export const Route = createFileRoute("/_public/chapas/acrilico")({
  component: Acrilico,
});
