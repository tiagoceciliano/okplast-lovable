import { Link } from "react-router-dom";
 import { ReactNode, useMemo } from "react";
import { Button } from "@/components/ui/button";
 import { Badge } from "@/components/ui/badge";
import { CheckCircle, MessageCircle } from "lucide-react";
import { useWhatsAppModal } from "@/contexts/WhatsAppModalContext";
 
 import { SEOHead, createBreadcrumbSchema, createProductSchema } from "@/components/SEOHead";

interface ProductPageProps {
  title: string;
  description: string;
  benefits: string[];
  variations?: string[];
  imageUrl?: string;
  children?: ReactNode;
   seoTitle?: string;
   seoDescription?: string;
   canonical?: string;
}

 export function ProductPage({ 
   title, 
   description, 
   benefits, 
   variations, 
   imageUrl, 
   children,
   seoTitle,
   seoDescription,
   canonical,
 }: ProductPageProps) {
  const { openWhatsAppModal } = useWhatsAppModal();
   
 
   const schemas = useMemo(() => {
     const breadcrumb = createBreadcrumbSchema([
       { name: "Home", url: "/" },
       { name: "Acrílico Sob Medida", url: "/acrilico-sob-medida" },
       { name: title },
     ]);
     
     const product = createProductSchema({
       name: title,
       description: description.substring(0, 200),
       image: imageUrl,
     });
     
     return {
       "@context": "https://schema.org",
       "@graph": [breadcrumb, product],
     };
   }, [title, description, imageUrl]);

  return (
    <>
       <SEOHead
         title={seoTitle || `${title} - Acrílico Sob Medida RJ`}
         description={seoDescription || `${description.substring(0, 150)}... Fabricação sob medida. Orçamento grátis.`}
         canonical={canonical}
         schema={schemas}
       />
 
       {/* Breadcrumb - Fora do hero */}
       <div className="bg-muted/50 py-3">
         <div className="container-custom">
           <nav className="flex items-center gap-2 text-sm text-muted-foreground" aria-label="Breadcrumb">
             <Link to="/" className="hover:text-foreground transition-colors">Home</Link>
             <span>/</span>
             <Link to="/acrilico-sob-medida" className="hover:text-foreground transition-colors">Acrílico Sob Medida</Link>
             <span>/</span>
             <span className="text-foreground" aria-current="page">{title}</span>
           </nav>
         </div>
       </div>
 
       {/* Hero - 2 colunas igual chapas */}
       <section className="bg-muted py-16 md:py-20">
         <div className="container-custom">
           <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
             {/* Left - Text */}
             <div>
               <h1 className="font-bold text-3xl md:text-4xl lg:text-5xl text-foreground mb-6">
                 {title.toUpperCase()}
               </h1>
               <p className="text-muted-foreground mb-8 text-lg">
                 {description}
               </p>
               <div className="flex flex-col items-start gap-3">
                 <Button 
                   size="lg" 
                   className="btn-whatsapp text-lg px-8 py-6"
                   onClick={() => openWhatsAppModal(title)}
                 >
                   <MessageCircle className="h-5 w-5 mr-2" />
                   Orçamento via WhatsApp
                 </Button>
                 <button 
                   onClick={() => openEmailModal(title)}
                   className="text-muted-foreground hover:text-foreground text-sm underline underline-offset-4"
                 >
                   Prefere orçamento via e-mail?
                 </button>
               </div>
             </div>
 
             {/* Right - Image */}
             {imageUrl && (
               <div className="aspect-[4/3] lg:aspect-square bg-muted rounded-lg overflow-hidden shadow-lg">
                 <img 
                   src={imageUrl} 
                   alt={`${title} - OK Plast`}
                   width={600}
                   height={600}
                   className="w-full h-full object-cover"
                   loading="eager"
                   fetchPriority="high"
                 />
               </div>
             )}
           </div>
         </div>
       </section>
 
       {/* Benefícios */}
       <section className="section-padding">
         <div className="container-custom">
           <h2 className="font-bold text-2xl md:text-3xl text-foreground mb-8">
             Benefícios e Diferenciais
           </h2>
           <ul className="grid grid-cols-1 md:grid-cols-2 gap-4" role="list">
             {benefits.map((benefit, index) => (
               <li key={index} className="flex items-start gap-3">
                 <CheckCircle className="h-5 w-5 text-accent shrink-0 mt-0.5" />
                 <span className="text-muted-foreground">{benefit}</span>
               </li>
             ))}
           </ul>
         </div>
       </section>
 
       {/* Variações */}
       {variations && variations.length > 0 && (
         <section className="section-padding bg-muted/30">
           <div className="container-custom">
             <h2 className="font-bold text-2xl md:text-3xl text-foreground mb-8">
               Variações Disponíveis
             </h2>
             <div className="flex flex-wrap gap-3">
               {variations.map((variation, index) => (
                 <Badge key={index} variant="secondary" className="text-sm py-2 px-4">
                   {variation}
                 </Badge>
               ))}
             </div>
           </div>
         </section>
       )}
 
       {/* Children - Conteúdo adicional */}
       {children}
 
       {/* CTA Final - Padrão chapas */}
       <section className="section-padding bg-muted">
         <div className="container-custom text-center">
           <h2 className="font-bold text-2xl md:text-3xl text-foreground mb-4">
             Solicite seu Orçamento
           </h2>
           <p className="text-muted-foreground mb-8 max-w-xl mx-auto">
             Fabricamos sob medida conforme suas especificações. Descreva seu projeto e receba um orçamento sem compromisso.
           </p>
           <div className="flex flex-col items-center gap-4">
             <Button 
               size="lg" 
               className="btn-whatsapp text-lg px-8 py-6"
               onClick={() => openWhatsAppModal(title)}
             >
               <MessageCircle className="h-5 w-5 mr-2" />
               Orçamento via WhatsApp
             </Button>
             <button 
               onClick={() => openEmailModal(title)}
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
