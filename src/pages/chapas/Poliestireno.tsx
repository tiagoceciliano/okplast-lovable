 import { Link } from "react-router-dom";
 import { SEOHead, createBreadcrumbSchema } from "@/components/SEOHead";
 import { Button } from "@/components/ui/button";
import { MessageCircle } from "lucide-react";
 import { DecorativeDivider } from "@/components/ui/DecorativeDivider";
 import { useWhatsAppModal } from "@/contexts/WhatsAppModalContext";
 import { RelatedProducts } from "@/components/seo/RelatedProducts";
 
 import heroPoliestireno from "@/assets/chapas-hero/poliestireno.webp";
 
 const espessuras = ["1mm", "2mm", "3mm", "4mm", "5mm"];
 
 const breadcrumbSchema = createBreadcrumbSchema([
   { name: "Home", url: "/" },
   { name: "Chapas", url: "/chapas" },
   { name: "Poliestireno" },
 ]);
 
 export default function Poliestireno() {
   const { openWhatsAppModal } = useWhatsAppModal();
   
   return (
     <>
       <SEOHead
         title="Chapa de Poliestireno no Rio de Janeiro - PS e PSAI | OK Plast"
         description="Compre chapas de poliestireno PS e PSAI no RJ. Custo-benefício excelente para displays, embalagens e molduras. Corte sob medida. Distribuidora no Rio de Janeiro."
         canonical="/chapas/poliestireno"
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
             <span className="text-foreground">Poliestireno</span>
           </nav>
         </div>
       </div>
 
       {/* Hero */}
       <section className="bg-muted py-16 md:py-20">
         <div className="container-custom">
           <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
             <div>
               <h1 className="font-bold text-3xl md:text-4xl lg:text-5xl text-foreground mb-6">
                 CHAPAS DE POLIESTIRENO NO RIO DE JANEIRO
               </h1>
               <p className="text-lg text-accent font-medium mb-4">
                 PS Cristal e PSAI (Alto Impacto) — distribuidora no RJ
               </p>
               <p className="text-muted-foreground mb-8">
                 Chapas de poliestireno com excelente custo-benefício. 
                 Ideais para molduras, displays descartáveis, embalagens e projetos de curta duração. 
                 Fácil corte e dobra com acabamento profissional. Disponível com corte sob medida na OK Plast, sua distribuidora no Rio de Janeiro.
               </p>
               <div className="flex flex-col items-start gap-3">
                 <Button 
                   size="lg" 
                   className="btn-whatsapp text-lg px-8 py-6"
                   onClick={() => openWhatsAppModal("Chapa de Poliestireno")}
                 >
                   <MessageCircle className="h-5 w-5 mr-2" />
                   Orçamento via WhatsApp
                 </Button>
               </div>
             </div>

             <div className="aspect-video bg-muted rounded-lg overflow-hidden">
               <img 
                 src={heroPoliestireno} 
                 alt="Chapa de poliestireno PS no Rio de Janeiro - OK Plast distribuidora"
                 className="w-full h-full object-cover"
                 loading="eager"
               />
             </div>
           </div>
         </div>
       </section>
 
       {/* Características Técnicas */}
       <section className="section-padding">
         <div className="container-custom">
           <DecorativeDivider />
           
           <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-start">
             <div>
               <h2 className="font-bold text-2xl md:text-3xl text-primary mb-4">
                 Poliestireno PS e PSAI no RJ
               </h2>
               <p className="text-muted-foreground mb-6">
                 O poliestireno é um termoplástico versátil e econômico. Oferecemos duas variações: 
                 PS Cristal (transparente e rígido) e PSAI Alto Impacto (mais resistente e opaco). 
                 Disponível na nossa distribuidora no Rio de Janeiro com corte sob medida.
               </p>
               
               <h3 className="font-semibold text-foreground mb-3">Principais Aplicações:</h3>
               <ul className="space-y-2 mb-6">
                 {[
                   "Molduras e porta-retratos",
                   "Displays descartáveis",
                   "Embalagens",
                   "Luminárias simples",
                   "Projetos de curta duração",
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
                   "Custo-benefício excelente",
                   "Fácil corte e dobra",
                   "Leve e versátil",
                   "Disponível em cristal e leitoso",
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
                 src={heroPoliestireno} 
                 alt="Aplicações do poliestireno PS no Rio de Janeiro - OK Plast"
                 className="w-full h-full object-cover"
                 loading="lazy"
               />
             </div>
           </div>
         </div>
       </section>
 
       {/* Espessuras */}
       <section className="section-padding bg-muted/30">
         <div className="container-custom">
           <div className="text-center mb-8">
             <h2 className="font-bold text-2xl md:text-3xl text-foreground mb-4">
               Espessuras Disponíveis
             </h2>
             <p className="text-muted-foreground max-w-2xl mx-auto">
               Trabalhamos com as espessuras mais utilizadas no mercado para atender 
               diferentes necessidades de projetos no Rio de Janeiro.
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

       <RelatedProducts currentSlug="poliestireno" />
 
       {/* CTA Final */}
      <section className="section-padding bg-muted">
         <div className="container-custom text-center">
          <h2 className="font-bold text-2xl md:text-3xl text-foreground mb-4">
            Solicite seu Orçamento de Poliestireno no RJ
           </h2>
          <p className="text-muted-foreground mb-8 max-w-xl mx-auto">
            Informe o tipo de chapa, espessura e dimensões desejadas para receber um orçamento personalizado.
           </p>
          <div className="flex flex-col items-center gap-4">
             <Button 
               size="lg" 
              className="btn-whatsapp text-lg px-8 py-6"
               onClick={() => openWhatsAppModal("Chapa de Poliestireno")}
             >
               <MessageCircle className="h-5 w-5 mr-2" />
              Orçamento via WhatsApp
             </Button>
           </div>
         </div>
       </section>
     </>
   );
 }
