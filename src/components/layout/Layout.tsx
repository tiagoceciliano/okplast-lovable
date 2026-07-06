import { ReactNode, lazy, Suspense } from "react";
import { Header } from "./Header";
import { WhatsAppFloatingButton } from "./WhatsAppFloatingButton";
import { useUTM } from "@/hooks/useUTM";
import { usePageVisit } from "@/hooks/usePageVisit";

// Abaixo da dobra — carregar depois para não bloquear LCP.
const Footer = lazy(() => import("./Footer").then((m) => ({ default: m.Footer })));

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
      </Suspense>
      {/* Renderizado imediatamente (não-lazy) para reservar espaço
          e eliminar o CLS causado pela montagem tardia do container fixo. */}
      <WhatsAppFloatingButton />
    </div>
  );
}
