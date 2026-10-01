import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/_public/sobre-nos")({
  beforeLoad: () => {
    throw redirect({ to: "/home/sobre-nos", replace: true });
  },
});
