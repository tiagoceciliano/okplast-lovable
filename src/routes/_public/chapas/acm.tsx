import { createFileRoute } from "@tanstack/react-router";
import Acm from "@/pages/chapas/Acm";

export const Route = createFileRoute("/_public/chapas/acm")({
  component: Acm,
});
