import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/_public/chapas-de-acrilico")({
  beforeLoad: () => {
    throw redirect({ to: "/chapas", replace: true });
  },
});
