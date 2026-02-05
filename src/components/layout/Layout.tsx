import { ReactNode } from "react";
import { Header } from "./Header";
import { Footer } from "./Footer";
import { WhatsAppFloatingButton } from "./WhatsAppFloatingButton";
import { useUTM } from "@/hooks/useUTM";
import { usePageVisit } from "@/hooks/usePageVisit";

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
      <Footer />
      <WhatsAppFloatingButton />
    </div>
  );
}
