import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/_public/politica-privacidade")({
  beforeLoad: () => {
    throw redirect({ to: "/home/politica-de-privacidade", replace: true });
  },
});
