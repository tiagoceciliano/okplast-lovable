 import { Link } from "react-router-dom";
 import { SEOHead, createBreadcrumbSchema } from "@/components/SEOHead";
 import { Button } from "@/components/ui/button";
import { MessageCircle } from "lucide-react";
 import { DecorativeDivider } from "@/components/ui/DecorativeDivider";
 import { useWhatsAppModal } from "@/contexts/WhatsAppModalContext";
 import { RelatedProducts } from "@/components/seo/RelatedProducts";
 
 import heroPetg from "@/assets/chapas-hero/petg.jpg";
 
 const espessuras = ["0.5mm", "1mm", "2mm", "3mm", "4mm", "5mm", "6mm", "8mm"];
 
 const breadcrumbSchema = createBreadcrumbSchema([
   { name: "Home", url: "/" },
   { name: "Chapas", url: "/chapas" },
   { name: "PETG" },
 ]);
 
 export default function Petg() {
   const { openWhatsAppModal } = useWhatsAppModal();
   
   return (
     <>
       <SEOHead
         title="Chapa PETG no Rio de Janeiro - Alta Resistência | OK Plast"
         description="Compre chapas PETG no RJ com alta resistência ao impacto e transparência. Atóxico, aprovado para contato com alimentos. Corte sob medida. Distribuidora no Rio de Janeiro."
         canonical="/chapas/petg"
         schema={breadcrumbSchema}
       />
 
       <div className="bg-muted/50 py-3">
         <div className="container-custom">
           <nav className="flex items-center gap-2 text-sm text-muted-foreground">
             <Link to="/" className="hover:text-foreground">Home</Link>
             <span>/</span>
             <Link to="/chapas" className="hover:text-foreground">Chapas</Link>
             <span>/</span>
             <span className="text-foreground">PETG</span>
           </nav>
         </div>
       </div>
 
       <section className="bg-muted py-16 md:py-20">
         <div className="container-custom">
           <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
             <div>
               <h1 className="font-bold text-3xl md:text-4xl lg:text-5xl text-foreground mb-6">
                 CHAPAS PETG NO RIO DE JANEIRO
               </h1>
               <p className="text-lg text-accent font-medium mb-4">
                 Alta resistência ao impacto e transparência — distribuidora no RJ
               </p>
               <p className="text-muted-foreground mb-8">
                 O PETG combina transparência cristalina com excepcional resistência ao impacto. 
                 Atóxico e aprovado para contato com alimentos, é ideal para displays alimentícios, 
                 proteções de máquinas e viseiras. Disponível com corte sob medida na OK Plast, distribuidora no Rio de Janeiro.
               </p>
               <div className="flex flex-col items-start gap-3">
                 <Button size="lg" className="btn-whatsapp text-lg px-8 py-6" onClick={() => openWhatsAppModal("Chapa PETG")}>
                   <MessageCircle className="h-5 w-5 mr-2" />
                   Orçamento via WhatsApp
                 </Button>
               </div>
             </div>

             <div className="aspect-video bg-muted rounded-lg overflow-hidden">
               <img src={heroPetg} alt="Chapa PETG transparente no RJ - OK Plast distribuidora" className="w-full h-full object-cover" loading="eager" />
             </div>
           </div>
         </div>
       </section>
 
       <section className="section-padding">
         <div className="container-custom">
           <DecorativeDivider />
           <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-start">
             <div>
               <h2 className="font-bold text-2xl md:text-3xl text-primary mb-4">
                 PETG - Polietileno Tereftalato Glicol no RJ
               </h2>
               <p className="text-muted-foreground mb-6">
                 O PETG é um termoplástico de alta performance que oferece excelente transparência, 
                 resistência química e mecânica. É a escolha ideal quando você precisa de resistência 
                 ao impacto combinada com segurança alimentar. Disponível na nossa distribuidora no Rio de Janeiro.
               </p>
               
               <h3 className="font-semibold text-foreground mb-3">Principais Aplicações:</h3>
               <ul className="space-y-2 mb-6">
                 {["Proteções de máquinas", "Viseiras e EPIs", "Displays para alimentos", "Mobiliário urbano", "Painéis de segurança"].map((item, i) => (
                   <li key={i} className="flex items-center gap-2 text-muted-foreground">
                     <div className="w-1.5 h-1.5 rounded-full bg-accent" />{item}
                   </li>
                 ))}
               </ul>

               <h3 className="font-semibold text-foreground mb-3">Características:</h3>
               <ul className="space-y-2">
                 {["Alta resistência ao impacto", "Atóxico (aprovado para contato com alimentos)", "Boa transparência", "Resistente a produtos químicos"].map((item, i) => (
                   <li key={i} className="flex items-center gap-2 text-muted-foreground">
                     <div className="w-1.5 h-1.5 rounded-full bg-accent" />{item}
                   </li>
                 ))}
               </ul>
             </div>

             <div className="aspect-video bg-muted rounded-lg overflow-hidden">
               <img src={heroPetg} alt="Aplicações do PETG no Rio de Janeiro - OK Plast" className="w-full h-full object-cover" loading="lazy" />
             </div>
           </div>
         </div>
       </section>
 
       <section className="section-padding bg-muted/30">
         <div className="container-custom">
           <div className="text-center mb-8">
             <h2 className="font-bold text-2xl md:text-3xl text-foreground mb-4">Espessuras Disponíveis</h2>
             <p className="text-muted-foreground max-w-2xl mx-auto">
               Oferecemos uma ampla gama de espessuras para atender desde projetos delicados até aplicações que exigem maior resistência no RJ.
             </p>
           </div>
           <div className="flex flex-wrap justify-center gap-3 max-w-3xl mx-auto">
             {espessuras.map((esp, index) => (
               <span key={index} className="px-4 py-2 bg-background rounded-full border border-border text-sm font-medium text-foreground">{esp}</span>
             ))}
           </div>
         </div>
       </section>

       <RelatedProducts currentSlug="petg" />
 
       <section className="section-padding bg-muted">
         <div className="container-custom text-center">
           <h2 className="font-bold text-2xl md:text-3xl text-foreground mb-4">Solicite seu Orçamento de PETG no RJ</h2>
           <p className="text-muted-foreground mb-8 max-w-xl mx-auto">Informe o tipo de chapa, espessura e dimensões desejadas para receber um orçamento personalizado.</p>
           <div className="flex flex-col items-center gap-4">
             <Button size="lg" className="btn-whatsapp text-lg px-8 py-6" onClick={() => openWhatsAppModal("Chapa PETG")}>
               <MessageCircle className="h-5 w-5 mr-2" />Orçamento via WhatsApp
             </Button>
           </div>
         </div>
       </section>
     </>
   );
 }
