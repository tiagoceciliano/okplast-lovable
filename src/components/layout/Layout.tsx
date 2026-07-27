import { ReactNode, lazy, Suspense, useState } from "react";
import { Header } from "./Header";
import { AlertBanner } from "./AlertBanner";
import { WhatsAppFloatingButton } from "./WhatsAppFloatingButton";
import { useUTM } from "@/hooks/useUTM";
import { usePageVisit } from "@/hooks/usePageVisit";
import { cn } from "@/lib/utils";

// Abaixo da dobra — carregar depois para não bloquear LCP.
const Footer = lazy(() => import("./Footer").then((m) => ({ default: m.Footer })));

interface LayoutProps {
  children: ReactNode;
}

export function Layout({ children }: LayoutProps) {
  const [bannerVisible, setBannerVisible] = useState(true);

  // Captura UTMs na primeira renderização
  useUTM();
  
  // Rastreia visitas para análise de conversão
  usePageVisit();

  return (
    <div className={cn("flex min-h-screen flex-col", bannerVisible && "pb-14 sm:pb-12")}>
      <Header />
      <main className="flex-1">{children}</main>
      <Suspense fallback={null}>
        <Footer />
      </Suspense>
      {/* Renderizado imediatamente (não-lazy) para reservar espaço
          e eliminar o CLS causado pela montagem tardia do container fixo. */}
      <WhatsAppFloatingButton bannerVisible={bannerVisible} />
      <AlertBanner onVisibilityChange={setBannerVisible} />
    </div>
  );
}
