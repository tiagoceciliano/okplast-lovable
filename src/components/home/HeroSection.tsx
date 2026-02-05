 import { MessageCircle } from "lucide-react";
 import { Button } from "@/components/ui/button";
 import { COMPANY } from "@/lib/constants";
 
 interface HeroSectionProps {
   onWhatsAppClick: () => void;
   onEmailClick: () => void;
 }
 
 export function HeroSection({ onWhatsAppClick, onEmailClick }: HeroSectionProps) {
   return (
     <section className="bg-background py-12 md:py-16 lg:py-20">
       <div className="container-custom">
         <div className="max-w-4xl mx-auto text-center">
           <h1 className="font-bold md:text-4xl lg:text-5xl text-foreground mb-4 leading-tight text-2xl">
             PRODUTOS DE <span className="text-accent">ACRÍLICO</span> E CHAPAS DIVERSAS
           </h1>
           <h2 className="text-lg md:text-xl text-accent font-medium mb-6">
             Acrílico, PS, Policarbonato, PETG, PVC, Poliestireno (PS), ACM.
           </h2>
           <p className="text-muted-foreground mb-8 max-w-2xl mx-auto">
             <strong className="text-foreground">{COMPANY.name}</strong> é especializada na fabricação de produtos em acrílico sob medida e venda de chapas. Há mais de 30 anos oferecendo qualidade, inovação e as melhores soluções em acrílico para todo o Brasil.
           </p>
           <div className="flex flex-col items-center gap-4">
             <Button size="lg" className="btn-whatsapp text-lg px-8 py-6" onClick={onWhatsAppClick}>
               <MessageCircle className="h-5 w-5 mr-2" />
               Orçamento via WhatsApp
             </Button>
             <button onClick={onEmailClick} className="text-muted-foreground hover:text-foreground text-sm underline underline-offset-4">
               Prefere orçamento via e-mail?
             </button>
           </div>
         </div>
       </div>
     </section>
   );
 }