 import { Link } from "react-router-dom";
 import { SEOHead, createBreadcrumbSchema } from "@/components/SEOHead";
 import { Button } from "@/components/ui/button";
import { MessageCircle } from "lucide-react";
 import { DecorativeDivider } from "@/components/ui/DecorativeDivider";
 import { useWhatsAppModal } from "@/contexts/WhatsAppModalContext";
 
 
 import heroAcm from "@/assets/chapas-hero/acm.jpg";
 
 const espessuras = ["3mm", "4mm", "5mm", "6mm"];
 
 const breadcrumbSchema = createBreadcrumbSchema([
   { name: "Home", url: "/" },
   { name: "Chapas", url: "/chapas" },
   { name: "ACM" },
 ]);
 
 export default function Acm() {
   const { openWhatsAppModal } = useWhatsAppModal();
   const { openEmailModal } = useEmailQuoteModal();
 
   return (
     <>
       <SEOHead
         title="Chapas ACM RJ - Fachadas e Letreiros"
         description="Chapas ACM (Alumínio Composto) para fachadas, letreiros e revestimentos externos. Alta durabilidade e diversas cores. Corte sob medida no Rio de Janeiro."
         canonical="/chapas/acm"
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
             <span className="text-foreground">ACM</span>
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
                 CHAPAS ACM
               </h1>
               <p className="text-lg text-accent font-medium mb-4">
                 Alumínio composto para fachadas e revestimentos
               </p>
               <p className="text-muted-foreground mb-8">
                 O ACM (Aluminium Composite Material) é composto por duas lâminas de alumínio 
                 com núcleo de polietileno. Material premium para fachadas, letreiros e 
                 revestimentos externos com acabamento profissional e alta durabilidade.
               </p>
               <div className="flex flex-col items-start gap-3">
                 <Button 
                   size="lg" 
                   className="btn-whatsapp text-lg px-8 py-6"
                   onClick={() => openWhatsAppModal("Chapa ACM")}
                 >
                   <MessageCircle className="h-5 w-5 mr-2" />
                   Orçamento via WhatsApp
                 </Button>
                 <button 
                   onClick={() => openEmailModal("Chapa ACM")}
                   className="text-muted-foreground hover:text-foreground text-sm underline underline-offset-4"
                 >
                   Prefere orçamento via e-mail?
                 </button>
               </div>
             </div>
 
             {/* Image */}
             <div className="aspect-video bg-muted rounded-lg overflow-hidden">
               <img 
                 src={heroAcm} 
                 alt="Chapa ACM Alumínio Composto"
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
                 ACM - Alumínio Composto
               </h2>
               <p className="text-muted-foreground mb-6">
                 As chapas ACM são compostas por duas lâminas de alumínio com núcleo de 
                 polietileno de baixa densidade. Esta estrutura proporciona rigidez, planeza 
                 e resistência às intempéries, tornando-o ideal para aplicações externas.
               </p>
               
               <h3 className="font-semibold text-foreground mb-3">Principais Aplicações:</h3>
               <ul className="space-y-2 mb-6">
                 {[
                   "Fachadas de lojas e edifícios",
                   "Letreiros e totens",
                   "Revestimentos externos",
                   "Painéis de sinalização",
                   "Mobiliário urbano",
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
                   "Alta durabilidade",
                   "Resistente a intempéries",
                   "Diversas cores disponíveis",
                   "Fácil manutenção",
                   "Excelente acabamento",
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
                 src={heroAcm} 
                 alt="Aplicações do ACM"
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
               Trabalhamos com as espessuras padrão do mercado para fachadas e comunicação visual.
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
               onClick={() => openWhatsAppModal("Chapa ACM")}
             >
               <MessageCircle className="h-5 w-5 mr-2" />
              Orçamento via WhatsApp
             </Button>
            <button 
               onClick={() => openEmailModal("Chapa ACM")}
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