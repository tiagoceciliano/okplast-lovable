 import { Link } from "react-router-dom";
 import { SEOHead, createBreadcrumbSchema } from "@/components/SEOHead";
 import { Button } from "@/components/ui/button";
import { MessageCircle } from "lucide-react";
 import { DecorativeDivider } from "@/components/ui/DecorativeDivider";
 import { useWhatsAppModal } from "@/contexts/WhatsAppModalContext";
 import { RelatedProducts } from "@/components/seo/RelatedProducts";
 
 import heroPolicarbonatoAlveolar from "@/assets/chapas-hero/policarbonato-alveolar.jpg";
 
 const espessuras = ["4mm", "6mm", "10mm", "16mm", "20mm", "25mm"];
 
 const breadcrumbSchema = createBreadcrumbSchema([
   { name: "Home", url: "/" },
   { name: "Chapas", url: "/chapas" },
   { name: "Policarbonato Alveolar" },
 ]);
 
 export default function PolicarbonatoAlveolar() {
   const { openWhatsAppModal } = useWhatsAppModal();
   
   return (
     <>
       <SEOHead
         title="Chapa de Policarbonato Alveolar no Rio de Janeiro | OK Plast"
         description="Compre chapas de policarbonato alveolar no RJ para coberturas e pergolados. Leve, com isolamento térmico e proteção UV. Corte sob medida. Distribuidora no Rio de Janeiro."
         canonical="/chapas/policarbonato-alveolar"
         schema={breadcrumbSchema}
       />
 
       <div className="bg-muted/50 py-3">
         <div className="container-custom">
           <nav className="flex items-center gap-2 text-sm text-muted-foreground">
             <Link to="/" className="hover:text-foreground">Home</Link>
             <span>/</span>
             <Link to="/chapas" className="hover:text-foreground">Chapas</Link>
             <span>/</span>
             <span className="text-foreground">Policarbonato Alveolar</span>
           </nav>
         </div>
       </div>
 
       <section className="bg-muted py-16 md:py-20">
         <div className="container-custom">
           <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
             <div>
               <h1 className="font-bold text-3xl md:text-4xl lg:text-5xl text-foreground mb-6">
                 CHAPAS POLICARBONATO ALVEOLAR NO RIO DE JANEIRO
               </h1>
               <p className="text-lg text-accent font-medium mb-4">
                 Ideal para coberturas e pergolados — distribuidora no RJ
               </p>
               <p className="text-muted-foreground mb-8">
                 O policarbonato alveolar é a solução perfeita para coberturas que precisam de 
                 leveza, isolamento térmico e passagem de luz. Estrutura multiparede com câmaras 
                 de ar que proporcionam conforto acústico e térmico. Disponível na OK Plast, distribuidora no Rio de Janeiro.
               </p>
               <div className="flex flex-col items-start gap-3">
                 <Button size="lg" className="btn-whatsapp text-lg px-8 py-6" onClick={() => openWhatsAppModal("Chapa Policarbonato Alveolar")}>
                   <MessageCircle className="h-5 w-5 mr-2" />Orçamento via WhatsApp
                 </Button>
               </div>
             </div>

             <div className="aspect-video bg-muted rounded-lg overflow-hidden">
               <img src={heroPolicarbonatoAlveolar} alt="Chapa de policarbonato alveolar no RJ - OK Plast distribuidora" className="w-full h-full object-cover" loading="eager" />
             </div>
           </div>
         </div>
       </section>
 
       <section className="section-padding">
         <div className="container-custom">
           <DecorativeDivider />
           <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-start">
             <div>
               <h2 className="font-bold text-2xl md:text-3xl text-primary mb-4">Policarbonato Alveolar Multiparede no RJ</h2>
               <p className="text-muted-foreground mb-6">
                 As chapas de policarbonato alveolar possuem estrutura com câmaras de ar internas, 
                 proporcionando isolamento térmico e acústico superior. Com proteção UV integrada, 
                 garantem durabilidade e resistência às intempéries. Distribuidora no Rio de Janeiro com entrega rápida.
               </p>
               
               <h3 className="font-semibold text-foreground mb-3">Principais Aplicações:</h3>
               <ul className="space-y-2 mb-6">
                 {["Coberturas e pergolados", "Telhados translúcidos", "Estufas agrícolas", "Fechamentos laterais", "Divisórias internas"].map((item, i) => (
                   <li key={i} className="flex items-center gap-2 text-muted-foreground"><div className="w-1.5 h-1.5 rounded-full bg-accent" />{item}</li>
                 ))}
               </ul>

               <h3 className="font-semibold text-foreground mb-3">Características:</h3>
               <ul className="space-y-2">
                 {["Leveza excepcional", "Isolamento térmico e acústico", "Proteção UV integrada", "Fácil instalação"].map((item, i) => (
                   <li key={i} className="flex items-center gap-2 text-muted-foreground"><div className="w-1.5 h-1.5 rounded-full bg-accent" />{item}</li>
                 ))}
               </ul>
             </div>

             <div className="aspect-video bg-muted rounded-lg overflow-hidden">
               <img src={heroPolicarbonatoAlveolar} alt="Aplicações do policarbonato alveolar no Rio de Janeiro - OK Plast" className="w-full h-full object-cover" loading="lazy" />
             </div>
           </div>
         </div>
       </section>
 
       <section className="section-padding bg-muted/30">
         <div className="container-custom">
           <div className="text-center mb-8">
             <h2 className="font-bold text-2xl md:text-3xl text-foreground mb-4">Espessuras Disponíveis</h2>
             <p className="text-muted-foreground max-w-2xl mx-auto">Quanto maior a espessura, maior o isolamento térmico e acústico. Escolha a espessura ideal para seu projeto no RJ.</p>
           </div>
           <div className="flex flex-wrap justify-center gap-3 max-w-3xl mx-auto">
             {espessuras.map((esp, index) => (
               <span key={index} className="px-4 py-2 bg-background rounded-full border border-border text-sm font-medium text-foreground">{esp}</span>
             ))}
           </div>
         </div>
       </section>

       <RelatedProducts currentSlug="policarbonato-alveolar" />
 
       <section className="section-padding bg-muted">
         <div className="container-custom text-center">
           <h2 className="font-bold text-2xl md:text-3xl text-foreground mb-4">Solicite seu Orçamento de Policarbonato Alveolar no RJ</h2>
           <p className="text-muted-foreground mb-8 max-w-xl mx-auto">Informe o tipo de chapa, espessura e dimensões desejadas para receber um orçamento personalizado.</p>
           <div className="flex flex-col items-center gap-4">
             <Button size="lg" className="btn-whatsapp text-lg px-8 py-6" onClick={() => openWhatsAppModal("Chapa Policarbonato Alveolar")}>
               <MessageCircle className="h-5 w-5 mr-2" />Orçamento via WhatsApp
             </Button>
           </div>
         </div>
       </section>
     </>
   );
 }
