import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/_public/termo-uso")({
  beforeLoad: () => {
    throw redirect({ to: "/home/termo-de-uso", replace: true });
  },
});
