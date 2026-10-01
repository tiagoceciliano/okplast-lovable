import { createFileRoute } from "@tanstack/react-router";
import Poliestireno from "@/pages/chapas/Poliestireno";

export const Route = createFileRoute("/_public/chapas/poliestireno")({
  component: Poliestireno,
});
