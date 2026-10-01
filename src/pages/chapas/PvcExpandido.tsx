 import { Link } from "@/lib/router-compat";
 import { SEOHead, createBreadcrumbSchema } from "@/components/SEOHead";
 import { Button } from "@/components/ui/button";
import { MessageCircle } from "lucide-react";
 import { DecorativeDivider } from "@/components/ui/DecorativeDivider";
 import { useWhatsAppModal } from "@/contexts/WhatsAppModalContext";
 import { RelatedProducts } from "@/components/seo/RelatedProducts";
 
 import heroPvcExpandido from "@/assets/chapas-hero/pvc-expandido.webp";
 
 const espessuras = ["1mm", "2mm", "3mm", "5mm", "8mm", "10mm", "15mm", "20mm"];
 
 const breadcrumbSchema = createBreadcrumbSchema([
   { name: "Home", url: "/" },
   { name: "Chapas", url: "/chapas" },
   { name: "PVC Expandido" },
 ]);
 
 export default function PvcExpandido() {
   const { openWhatsAppModal } = useWhatsAppModal();
   
   return (
     <>
       <SEOHead
         title="Chapa de PVC Expandido no Rio de Janeiro | OK Plast"
         description="Compre chapas de PVC expandido no RJ para comunicação visual e displays. Leve, fácil de trabalhar e resistente à umidade. Corte sob medida. Distribuidora no Rio de Janeiro."
         canonical="/chapas/pvc-expandido"
         schema={breadcrumbSchema}
       />
 
       <div className="bg-muted/50 py-3">
         <div className="container-custom">
           <nav className="flex items-center gap-2 text-sm text-muted-foreground">
             <Link to="/" className="hover:text-foreground">Home</Link>
             <span>/</span>
             <Link to="/chapas" className="hover:text-foreground">Chapas</Link>
             <span>/</span>
             <span className="text-foreground">PVC Expandido</span>
           </nav>
         </div>
       </div>
 
       <section className="bg-muted py-16 md:py-20">
         <div className="container-custom">
           <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
             <div>
               <h1 className="font-bold text-3xl md:text-4xl lg:text-5xl text-foreground mb-6">
                 CHAPAS DE PVC EXPANDIDO NO RIO DE JANEIRO
               </h1>
               <p className="text-lg text-accent font-medium mb-4">
                 Leve e versátil para comunicação visual — distribuidora no RJ
               </p>
               <p className="text-muted-foreground mb-8">
                 O PVC expandido é o material preferido para comunicação visual e sinalização no Rio de Janeiro. 
                 Extremamente leve, fácil de cortar e com excelente superfície para impressão 
                 direta ou adesivagem. Disponível com corte sob medida na OK Plast.
               </p>
               <div className="flex flex-col items-start gap-3">
                 <Button size="lg" className="btn-whatsapp text-lg px-8 py-6" onClick={() => openWhatsAppModal("Chapa PVC Expandido")}>
                   <MessageCircle className="h-5 w-5 mr-2" />Orçamento via WhatsApp
                 </Button>
               </div>
             </div>

             <div className="aspect-video bg-muted rounded-lg overflow-hidden">
               <img src={heroPvcExpandido} alt="Chapa de PVC expandido no RJ - OK Plast distribuidora" className="w-full h-full object-cover" loading="eager" />
             </div>
           </div>
         </div>
       </section>
 
       <section className="section-padding">
         <div className="container-custom">
           <DecorativeDivider />
           <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-start">
             <div>
               <h2 className="font-bold text-2xl md:text-3xl text-primary mb-4">PVC Expandido (Foam Board) no RJ</h2>
               <p className="text-muted-foreground mb-6">
                 As chapas de PVC expandido possuem estrutura celular fechada que proporciona 
                 leveza extrema mantendo boa rigidez. Material ideal para quem busca versatilidade 
                 em projetos de comunicação visual, cenografia e displays no Rio de Janeiro.
               </p>
               
               <h3 className="font-semibold text-foreground mb-3">Principais Aplicações:</h3>
               <ul className="space-y-2 mb-6">
                 {["Painéis de comunicação visual", "Displays e totens", "Revestimentos internos", "Projetos de cenografia", "Maquetes e protótipos"].map((item, i) => (
                   <li key={i} className="flex items-center gap-2 text-muted-foreground"><div className="w-1.5 h-1.5 rounded-full bg-accent" />{item}</li>
                 ))}
               </ul>

               <h3 className="font-semibold text-foreground mb-3">Características:</h3>
               <ul className="space-y-2">
                 {["Extremamente leve", "Fácil de trabalhar", "Boa impressão direta", "Resistente à umidade", "Não propaga chamas"].map((item, i) => (
                   <li key={i} className="flex items-center gap-2 text-muted-foreground"><div className="w-1.5 h-1.5 rounded-full bg-accent" />{item}</li>
                 ))}
               </ul>
             </div>

             <div className="aspect-video bg-muted rounded-lg overflow-hidden">
               <img src={heroPvcExpandido} alt="Aplicações do PVC expandido no Rio de Janeiro - OK Plast" className="w-full h-full object-cover" loading="lazy" />
             </div>
           </div>
         </div>
       </section>
 
       <section className="section-padding bg-muted/30">
         <div className="container-custom">
           <div className="text-center mb-8">
             <h2 className="font-bold text-2xl md:text-3xl text-foreground mb-4">Espessuras Disponíveis</h2>
             <p className="text-muted-foreground max-w-2xl mx-auto">Oferecemos desde chapas finas para adesivagem até espessuras maiores para projetos estruturais e displays 3D no RJ.</p>
           </div>
           <div className="flex flex-wrap justify-center gap-3 max-w-3xl mx-auto">
             {espessuras.map((esp, index) => (
               <span key={index} className="px-4 py-2 bg-background rounded-full border border-border text-sm font-medium text-foreground">{esp}</span>
             ))}
           </div>
         </div>
       </section>

       <RelatedProducts currentSlug="pvc-expandido" />
 
       <section className="section-padding bg-muted">
         <div className="container-custom text-center">
           <h2 className="font-bold text-2xl md:text-3xl text-foreground mb-4">Solicite seu Orçamento de PVC Expandido no RJ</h2>
           <p className="text-muted-foreground mb-8 max-w-xl mx-auto">Informe o tipo de chapa, espessura e dimensões desejadas para receber um orçamento personalizado.</p>
           <div className="flex flex-col items-center gap-4">
             <Button size="lg" className="btn-whatsapp text-lg px-8 py-6" onClick={() => openWhatsAppModal("Chapa PVC Expandido")}>
               <MessageCircle className="h-5 w-5 mr-2" />Orçamento via WhatsApp
             </Button>
           </div>
         </div>
       </section>
     </>
   );
 }
