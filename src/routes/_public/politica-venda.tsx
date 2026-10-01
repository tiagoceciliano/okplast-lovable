import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/_public/politica-venda")({
  beforeLoad: () => {
    throw redirect({ to: "/home/politica-de-venda", replace: true });
  },
});
