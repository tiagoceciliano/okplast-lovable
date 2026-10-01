import { createFileRoute, Outlet } from "@tanstack/react-router";
import { Layout } from "@/components/layout/Layout";
import { WhatsAppModalProvider } from "@/contexts/WhatsAppModalContext";

export const Route = createFileRoute("/_public")({
  component: PublicLayout,
});

function PublicLayout() {
  return (
    <WhatsAppModalProvider>
      <Layout>
        <Outlet />
      </Layout>
    </WhatsAppModalProvider>
  );
}
