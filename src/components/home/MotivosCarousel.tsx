import { useCallback } from "react";
import useEmblaCarousel from "embla-carousel-react";
import { ChevronLeft, ChevronRight, FileText, CreditCard, Building, Package, Truck, Headphones } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { MOTIVOS_IMAGES } from "@/lib/images";

const motivos = [
  { 
    icon: FileText, 
    titulo: "Emissão de NF-e", 
    desc: "Nota fiscal eletrônica em todas as compras para sua segurança e garantia",
    bgImage: MOTIVOS_IMAGES.credito // usando credito pois nfe deu 404
  },
  { 
    icon: CreditCard, 
    titulo: "Faturamento e Linha de Crédito", 
    desc: "Condições especiais de pagamento para clientes corporativos",
    bgImage: MOTIVOS_IMAGES.credito
  },
  { 
    icon: Building, 
    titulo: "Empresa Sólida e Confiável", 
    desc: "Mais de 30 anos de tradição no mercado de acrílico",
    bgImage: MOTIVOS_IMAGES.empresaSolida
  },
  { 
    icon: Package, 
    titulo: "Pronta Entrega", 
    desc: "Estoque completo para atendimento imediato dos seus pedidos",
    bgImage: MOTIVOS_IMAGES.prontaEntrega
  },
  { 
    icon: Truck, 
    titulo: "Entrega em Todo Brasil", 
    desc: "Logística eficiente com entrega segura para todo território nacional",
    bgImage: MOTIVOS_IMAGES.entregaBrasil
  },
  { 
    icon: Headphones, 
    titulo: "Atendimento Rápido", 
    desc: "Equipe especializada pronta para atender suas necessidades",
    bgImage: MOTIVOS_IMAGES.atendimento
  },
];

interface MotivosCarouselProps {
  className?: string;
}

export function MotivosCarousel({ className }: MotivosCarouselProps) {
  const [emblaRef, emblaApi] = useEmblaCarousel({
    align: "start",
    loop: true,
    slidesToScroll: 1,
  });

  const scrollPrev = useCallback(() => {
    if (emblaApi) emblaApi.scrollPrev();
  }, [emblaApi]);

  const scrollNext = useCallback(() => {
    if (emblaApi) emblaApi.scrollNext();
  }, [emblaApi]);

  return (
    <div className={cn("relative", className)}>
      {/* Navigation arrows */}
      <Button
        variant="outline"
        size="icon"
        className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 z-10 bg-background shadow-lg hidden md:flex"
        onClick={scrollPrev}
      >
        <ChevronLeft className="h-5 w-5" />
      </Button>
      
      <Button
        variant="outline"
        size="icon"
        className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 z-10 bg-background shadow-lg hidden md:flex"
        onClick={scrollNext}
      >
        <ChevronRight className="h-5 w-5" />
      </Button>

      <div className="overflow-hidden px-2" ref={emblaRef}>
        <div className="flex gap-4">
          {motivos.map((motivo, index) => (
            <div 
              key={index} 
              className="flex-[0_0_100%] md:flex-[0_0_calc(33.333%-12px)] min-w-0"
            >
              <div 
                className="relative h-[280px] rounded-lg overflow-hidden group"
                style={{
                  backgroundImage: `url(${motivo.bgImage})`,
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                }}
              >
                {/* Overlay */}
                <div className="absolute inset-0 bg-primary/80 group-hover:bg-primary/70 transition-colors" />
                
                {/* Content */}
                <div className="relative z-10 h-full flex flex-col items-center justify-center p-6 text-center text-primary-foreground">
                  <div className="w-16 h-16 rounded-full bg-accent/20 flex items-center justify-center mb-4">
                    <motivo.icon className="h-8 w-8 text-accent" />
                  </div>
                  <h3 className="font-bold text-lg mb-2">{motivo.titulo}</h3>
                  <p className="text-sm text-primary-foreground/80">{motivo.desc}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Mobile navigation */}
      <div className="flex justify-center gap-4 mt-4 md:hidden">
        <Button variant="outline" size="icon" onClick={scrollPrev}>
          <ChevronLeft className="h-5 w-5" />
        </Button>
        <Button variant="outline" size="icon" onClick={scrollNext}>
          <ChevronRight className="h-5 w-5" />
        </Button>
      </div>
    </div>
  );
}
