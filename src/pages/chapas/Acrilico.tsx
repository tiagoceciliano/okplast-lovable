 import { Link } from "react-router-dom";
 import { SEOHead, createBreadcrumbSchema } from "@/components/SEOHead";
 import { Button } from "@/components/ui/button";
import { MessageCircle } from "lucide-react";
 import { DecorativeDivider } from "@/components/ui/DecorativeDivider";
 import { useWhatsAppModal } from "@/contexts/WhatsAppModalContext";
 import { useEmailQuoteModal } from "@/contexts/EmailQuoteModalContext";
 import {
   Carousel,
   CarouselContent,
   CarouselItem,
 } from "@/components/ui/carousel";
 import Autoplay from "embla-carousel-autoplay";
 import { useRef } from "react";
 
 import heroAcrilicoTransparente from "@/assets/chapas-hero/acrilico-transparente.jpg";
 import heroAcrilicoColorido from "@/assets/chapas-hero/acrilico-colorido.jpg";
 
 const heroImages = [
   { src: heroAcrilicoTransparente, alt: "Chapa de Acrílico Cristal Transparente" },
   { src: heroAcrilicoColorido, alt: "Chapas de Acrílico Colorido" },
 ];
 
 // Cores disponíveis
 const coresDisponiveis = [
   { nome: "Cristal", cor: "transparent" },
   { nome: "Branco", cor: "#FFFFFF" },
   { nome: "Preto", cor: "#000000" },
   { nome: "Vermelho", cor: "#E53935" },
   { nome: "Azul", cor: "#1E88E5" },
   { nome: "Verde", cor: "#43A047" },
   { nome: "Amarelo", cor: "#FDD835" },
   { nome: "Laranja", cor: "#FB8C00" },
   { nome: "Fumê", cor: "#424242" },
   { nome: "Espelhado", cor: "linear-gradient(135deg, #C0C0C0, #FFFFFF, #C0C0C0)" },
   { nome: "Leitoso", cor: "#F5F5F5" },
   { nome: "Fluorescente", cor: "linear-gradient(135deg, #FF1493, #00FF00)" },
 ];
 
 // Espessuras disponíveis
 const espessuras = ["1mm", "2mm", "3mm", "4mm", "5mm", "6mm", "8mm", "10mm", "15mm", "20mm", "25mm", "30mm", "40mm", "50mm"];
 
 const breadcrumbSchema = createBreadcrumbSchema([
   { name: "Home", url: "/" },
   { name: "Chapas", url: "/chapas" },
   { name: "Acrílico" },
 ]);
 
 export default function Acrilico() {
   const { openWhatsAppModal } = useWhatsAppModal();
   const { openEmailModal } = useEmailQuoteModal();
   const autoplayPlugin = useRef(
     Autoplay({ delay: 3000, stopOnInteraction: false })
   );
 
   return (
     <>
       <SEOHead
         title="Chapas de Acrílico RJ - Cristal, Colorido, Espelhado, Fumê"
         description="Chapas de acrílico 100% virgem. Cristal transparente, colorido, leitoso, espelhado e fumê. Corte sob medida. Melhor preço do Rio de Janeiro."
         canonical="/chapas/acrilico"
         schema={breadcrumbSchema}
       />
 
       {/* Breadcrumb */}
       <div className="bg-muted/50 py-3">
         <div className="container-custom">
           <nav className="flex items-center gap-2 text-sm text-muted-foreground">
             <Link to="/" className="hover:text-foreground">Home</Link>
             <span>/</span>
             <Link to="/chapas" className="hover:text-foreground">Chapas</Link>
             <span>/</span>
             <span className="text-foreground">Acrílico</span>
           </nav>
         </div>
       </div>
 
       {/* Hero */}
       <section className="bg-muted py-16 md:py-20">
         <div className="container-custom">
           <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
             {/* Text */}
             <div>
               <h1 className="font-bold text-3xl md:text-4xl lg:text-5xl text-foreground mb-6">
                 CHAPAS DE ACRÍLICO
               </h1>
               <p className="text-lg text-accent font-medium mb-4">
                 Cristal, colorido, leitoso, espelhado e fumê
               </p>
               <p className="text-muted-foreground mb-8">
                 Chapas de acrílico CAST 100% virgem com a mais alta qualidade. 
                 Transparência cristalina, diversas cores e espessuras de 1mm a 50mm. 
                 Corte sob medida para qualquer projeto.
               </p>
               <div className="flex flex-col items-start gap-3">
                 <Button 
                   size="lg" 
                   className="btn-whatsapp text-lg px-8 py-6"
                   onClick={() => openWhatsAppModal("Chapa de Acrílico")}
                 >
                   <MessageCircle className="h-5 w-5 mr-2" />
                   Orçamento via WhatsApp
                 </Button>
                 <button 
                   onClick={() => openEmailModal("Chapa de Acrílico")}
                   className="text-muted-foreground hover:text-foreground text-sm underline underline-offset-4"
                 >
                   Prefere orçamento via e-mail?
                 </button>
               </div>
             </div>
 
             {/* Carousel */}
             <div className="aspect-video bg-muted rounded-lg overflow-hidden">
               <Carousel
                 plugins={[autoplayPlugin.current]}
                 opts={{ loop: true }}
                 className="w-full h-full"
               >
                 <CarouselContent className="h-full -ml-0">
                   {heroImages.map((image, index) => (
                     <CarouselItem key={index} className="h-full pl-0">
                       <img 
                         src={image.src} 
                         alt={image.alt}
                         className="w-full h-full object-cover"
                         loading={index === 0 ? "eager" : "lazy"}
                       />
                     </CarouselItem>
                   ))}
                 </CarouselContent>
               </Carousel>
             </div>
           </div>
         </div>
       </section>
 
       {/* Cores Disponíveis */}
       <section className="section-padding">
         <div className="container-custom">
           <DecorativeDivider />
           
           <div className="text-center mb-12">
             <h2 className="font-bold text-2xl md:text-3xl text-foreground mb-4">
               Chapas de acrílico cristal e diversas cores
             </h2>
             <p className="text-muted-foreground max-w-3xl mx-auto">
               Trabalhamos com uma ampla variedade de cores e acabamentos para atender qualquer projeto. 
               Todas as chapas passam por rigoroso controle de qualidade.
             </p>
           </div>
 
           {/* Grid de cores */}
           <div className="grid grid-cols-4 md:grid-cols-6 lg:grid-cols-12 gap-3 mb-12">
             {coresDisponiveis.map((cor, index) => (
               <div key={index} className="text-center">
                 <div 
                   className="w-full aspect-square rounded-lg border-2 border-border shadow-sm mb-2"
                   style={{ 
                     background: cor.cor === "transparent" 
                       ? "repeating-conic-gradient(#ccc 0% 25%, transparent 0% 50%) 50% / 10px 10px"
                       : cor.cor
                   }}
                 />
                 <span className="text-xs text-muted-foreground">{cor.nome}</span>
               </div>
             ))}
           </div>
         </div>
       </section>
 
       {/* Acrílico Cristal */}
       <section className="section-padding bg-muted/30">
         <div className="container-custom">
           <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-start">
             <div>
               <h2 className="font-bold text-2xl md:text-3xl text-primary mb-4">
                 Acrílico Cristal (Transparente)
               </h2>
               <p className="text-muted-foreground mb-6">
                 O acrílico cristal é o tipo mais utilizado no mercado. Com 92% de transmissão de luz, 
                 oferece transparência superior ao vidro e é 17 vezes mais resistente ao impacto.
               </p>
               
               <h3 className="font-semibold text-foreground mb-3">Principais Aplicações:</h3>
               <ul className="space-y-2 mb-6">
                 {[
                   "Vitrines e displays de alto padrão",
                   "Aquários e piscinas",
                   "Projetos arquitetônicos",
                   "Luminárias e decoração",
                   "Proteções de máquinas",
                   "Comunicação visual",
                 ].map((item, i) => (
                   <li key={i} className="flex items-center gap-2 text-muted-foreground">
                     <div className="w-1.5 h-1.5 rounded-full bg-accent" />
                     {item}
                   </li>
                 ))}
               </ul>
 
               <h3 className="font-semibold text-foreground mb-3">Características:</h3>
               <ul className="space-y-2">
                 {[
                   "Transparência cristalina (92% de transmissão de luz)",
                   "Resistência a UV e intempéries",
                   "Fácil usinagem, corte e polimento",
                   "Leve (metade do peso do vidro)",
                   "Atóxico e reciclável",
                 ].map((item, i) => (
                   <li key={i} className="flex items-center gap-2 text-muted-foreground">
                     <div className="w-1.5 h-1.5 rounded-full bg-accent" />
                     {item}
                   </li>
                 ))}
               </ul>
             </div>
 
             <div className="aspect-video bg-muted rounded-lg overflow-hidden">
               <img 
                 src={heroAcrilicoTransparente} 
                 alt="Chapa de Acrílico Cristal Transparente"
                 className="w-full h-full object-cover"
                 loading="lazy"
               />
             </div>
           </div>
         </div>
       </section>
 
       {/* Acrílico Colorido */}
       <section className="section-padding">
         <div className="container-custom">
           <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-start">
             <div className="lg:order-2">
               <h2 className="font-bold text-2xl md:text-3xl text-primary mb-4">
                 Acrílico Colorido e Especial
               </h2>
               <p className="text-muted-foreground mb-6">
                 Além do cristal, oferecemos uma ampla gama de cores e acabamentos especiais 
                 para projetos diferenciados e personalizados.
               </p>
               
               <h3 className="font-semibold text-foreground mb-3">Variedades Disponíveis:</h3>
               <ul className="space-y-2 mb-6">
                 {[
                   "Cores sólidas: preto, branco, vermelho, azul, verde, amarelo, laranja",
                   "Fumê: ideal para proteção solar e privacidade",
                   "Espelhado: acabamento metalizado para decoração",
                   "Leitoso: difusão de luz para luminárias",
                   "Fluorescente: cores vibrantes para comunicação visual",
                 ].map((item, i) => (
                   <li key={i} className="flex items-center gap-2 text-muted-foreground">
                     <div className="w-1.5 h-1.5 rounded-full bg-accent" />
                     {item}
                   </li>
                 ))}
               </ul>
 
               <h3 className="font-semibold text-foreground mb-3">Aplicações Específicas:</h3>
               <ul className="space-y-2">
                 {[
                   "Troféus e placas comemorativas",
                   "Letras e logotipos 3D",
                   "Divisórias coloridas",
                   "Mobiliário design",
                   "Peças decorativas",
                 ].map((item, i) => (
                   <li key={i} className="flex items-center gap-2 text-muted-foreground">
                     <div className="w-1.5 h-1.5 rounded-full bg-accent" />
                     {item}
                   </li>
                 ))}
               </ul>
             </div>
 
             <div className="lg:order-1 aspect-video bg-muted rounded-lg overflow-hidden">
               <img 
                 src={heroAcrilicoColorido} 
                 alt="Chapas de Acrílico Colorido"
                 className="w-full h-full object-cover"
                 loading="lazy"
               />
             </div>
           </div>
         </div>
       </section>
 
       {/* Espessuras Disponíveis */}
       <section className="section-padding bg-muted/30">
         <div className="container-custom">
           <div className="text-center mb-8">
             <h2 className="font-bold text-2xl md:text-3xl text-foreground mb-4">
               Espessuras Disponíveis
             </h2>
             <p className="text-muted-foreground max-w-2xl mx-auto">
               Trabalhamos com uma ampla variedade de espessuras para atender diferentes necessidades, 
               desde trabalhos delicados até projetos estruturais.
             </p>
           </div>
           
           <div className="flex flex-wrap justify-center gap-3 max-w-3xl mx-auto">
             {espessuras.map((esp, index) => (
               <span 
                 key={index}
                 className="px-4 py-2 bg-background rounded-full border border-border text-sm font-medium text-foreground"
               >
                 {esp}
               </span>
             ))}
           </div>
         </div>
       </section>
 
       {/* CTA Final */}
      <section className="section-padding bg-muted">
         <div className="container-custom text-center">
          <h2 className="font-bold text-2xl md:text-3xl text-foreground mb-4">
            Solicite seu Orçamento
           </h2>
          <p className="text-muted-foreground mb-8 max-w-xl mx-auto">
            Informe o tipo de chapa, espessura e dimensões desejadas para receber um orçamento personalizado.
           </p>
          <div className="flex flex-col items-center gap-4">
             <Button 
               size="lg" 
              className="btn-whatsapp text-lg px-8 py-6"
               onClick={() => openWhatsAppModal("Chapa de Acrílico")}
             >
               <MessageCircle className="h-5 w-5 mr-2" />
              Orçamento via WhatsApp
             </Button>
            <button 
               onClick={() => openEmailModal("Chapa de Acrílico")}
              className="text-muted-foreground hover:text-foreground text-sm underline underline-offset-4"
             >
              Prefere orçamento via e-mail?
            </button>
           </div>
         </div>
       </section>
     </>
   );
 }