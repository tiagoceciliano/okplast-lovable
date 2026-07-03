import { ReactNode, lazy, Suspense } from "react";
import { Header } from "./Header";
import { useUTM } from "@/hooks/useUTM";
import { usePageVisit } from "@/hooks/usePageVisit";

// Abaixo da dobra — carregar depois para não bloquear LCP.
const Footer = lazy(() => import("./Footer").then((m) => ({ default: m.Footer })));
const WhatsAppFloatingButton = lazy(() =>
  import("./WhatsAppFloatingButton").then((m) => ({ default: m.WhatsAppFloatingButton })),
);

interface LayoutProps {
  children: ReactNode;
}

export function Layout({ children }: LayoutProps) {
  // Captura UTMs na primeira renderização
  useUTM();
  
  // Rastreia visitas para análise de conversão
  usePageVisit();

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1">{children}</main>
      <Suspense fallback={null}>
        <Footer />
        <WhatsAppFloatingButton />
      </Suspense>
    </div>
  );
}
