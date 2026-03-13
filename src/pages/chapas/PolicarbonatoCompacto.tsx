 import { Link } from "react-router-dom";
 import { SEOHead, createBreadcrumbSchema } from "@/components/SEOHead";
 import { Button } from "@/components/ui/button";
import { MessageCircle } from "lucide-react";
 import { DecorativeDivider } from "@/components/ui/DecorativeDivider";
 import { useWhatsAppModal } from "@/contexts/WhatsAppModalContext";
 
 
 import heroPolicarbonatoCompacto from "@/assets/chapas-hero/policarbonato-compacto.jpg";
 
 const espessuras = ["1mm", "2mm", "3mm", "4mm", "5mm", "6mm", "8mm", "10mm"];
 
 const breadcrumbSchema = createBreadcrumbSchema([
   { name: "Home", url: "/" },
   { name: "Chapas", url: "/chapas" },
   { name: "Policarbonato Compacto" },
 ]);
 
 export default function PolicarbonatoCompacto() {
   const { openWhatsAppModal } = useWhatsAppModal();
   
 
   return (
     <>
       <SEOHead
         title="Chapas Policarbonato Compacto RJ - Segurança"
         description="Chapas de Policarbonato Compacto - 250x mais resistente que o vidro. Ideal para blindagem, vitrines e proteções industriais. Corte sob medida no Rio de Janeiro."
         canonical="/chapas/policarbonato-compacto"
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
             <span className="text-foreground">Policarbonato Compacto</span>
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
                 CHAPAS POLICARBONATO COMPACTO
               </h1>
               <p className="text-lg text-accent font-medium mb-4">
                 250x mais resistente que o vidro
               </p>
               <p className="text-muted-foreground mb-8">
                 O policarbonato compacto é virtualmente inquebrável. Com transparência similar ao vidro 
                 e resistência ao impacto incomparável, é a escolha ideal para aplicações de segurança, 
                 blindagem arquitetônica e proteções industriais.
               </p>
               <div className="flex flex-col items-start gap-3">
                 <Button 
                   size="lg" 
                   className="btn-whatsapp text-lg px-8 py-6"
                   onClick={() => openWhatsAppModal("Chapa Policarbonato Compacto")}
                 >
                   <MessageCircle className="h-5 w-5 mr-2" />
                   Orçamento via WhatsApp
                 </Button>
               </div>
             </div>
 
             {/* Image */}
             <div className="aspect-video bg-muted rounded-lg overflow-hidden">
               <img 
                 src={heroPolicarbonatoCompacto} 
                 alt="Chapa Policarbonato Compacto"
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
                 Policarbonato Compacto de Alta Segurança
               </h2>
               <p className="text-muted-foreground mb-6">
                 O policarbonato compacto oferece a maior resistência ao impacto entre os plásticos 
                 de engenharia. Com 250 vezes mais resistência que o vidro e metade do peso, é a 
                 solução definitiva para segurança sem comprometer a estética.
               </p>
               
               <h3 className="font-semibold text-foreground mb-3">Principais Aplicações:</h3>
               <ul className="space-y-2 mb-6">
                 {[
                   "Blindagem arquitetônica",
                   "Escudos de proteção",
                   "Vitrines de segurança",
                   "Proteções industriais",
                   "Coberturas de alto impacto",
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
                   "Extrema resistência ao impacto",
                   "Transparência similar ao vidro",
                   "Resistente a vandalismo",
                   "Proteção UV integrada",
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
                 src={heroPolicarbonatoCompacto} 
                 alt="Aplicações do Policarbonato Compacto"
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
               Espessuras maiores oferecem maior proteção balística e resistência estrutural. 
               Consulte-nos para especificações técnicas detalhadas.
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
               onClick={() => openWhatsAppModal("Chapa Policarbonato Compacto")}
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