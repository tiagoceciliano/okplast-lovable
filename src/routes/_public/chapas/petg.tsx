import { createFileRoute } from "@tanstack/react-router";
import Petg from "@/pages/chapas/Petg";

export const Route = createFileRoute("/_public/chapas/petg")({
  component: Petg,
});
