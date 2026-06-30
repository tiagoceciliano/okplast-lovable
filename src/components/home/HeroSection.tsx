import { MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { COMPANY } from "@/lib/constants";

interface HeroSectionProps {
  onWhatsAppClick: () => void;
}

export function HeroSection({ onWhatsAppClick }: HeroSectionProps) {
  return (
    <section className="bg-background py-8 md:py-12">
      <div className="container-custom">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="font-bold md:text-4xl lg:text-5xl text-foreground mb-4 leading-tight text-2xl">
            DISTRIBUIDORA DE <span className="text-accent">CHAPAS</span> NO RIO DE JANEIRO
          </h1>
          <h2 className="text-lg md:text-xl text-accent font-medium mb-6">
            Acrílico, Policarbonato, PETG, Poliestireno (PS), PVC Expandido e ACM no RJ
          </h2>
          <p className="text-muted-foreground mb-8 max-w-2xl mx-auto">
            <strong className="text-foreground">{COMPANY.name}</strong> — {COMPANY.slogan}. Sua distribuidora de chapas plásticas no Rio de Janeiro com corte sob medida e o melhor preço do RJ. Atendemos toda a região metropolitana com entrega rápida.
          </p>
          <div className="flex flex-col items-center gap-4">
            <Button size="lg" className="btn-whatsapp text-lg px-8 py-6" onClick={onWhatsAppClick}>
              <MessageCircle className="h-5 w-5 mr-2" />
              Orçamento via WhatsApp
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
