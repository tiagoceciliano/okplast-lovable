import { createFileRoute } from "@tanstack/react-router";
import SobreNos from "@/pages/SobreNos";

export const Route = createFileRoute("/_public/home/sobre-nos")({
  component: SobreNos,
});
