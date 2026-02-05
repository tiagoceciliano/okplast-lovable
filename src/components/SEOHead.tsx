 import { Helmet } from "react-helmet-async";
 
 interface SEOHeadProps {
   title?: string;
   description?: string;
   canonical?: string;
   ogImage?: string;
   noindex?: boolean;
   schema?: object;
 }
 
 const BASE_URL = "https://labacrilicos.com.br";
 const DEFAULT_OG_IMAGE = `${BASE_URL}/og-image.jpg`;
 
 export function SEOHead({
   title = "Lab Acrílicos | Fábrica de Acrílico e Chapas no Rio de Janeiro",
   description = "Fábrica de produtos em acrílico sob medida e distribuidora de chapas. Troféus, medalhas, displays, urnas e mais. Atendimento em 24h. Rio de Janeiro.",
   canonical,
   ogImage = DEFAULT_OG_IMAGE,
   noindex = false,
   schema,
 }: SEOHeadProps) {
   const fullTitle = title.includes("Lab Acrílicos") ? title : `${title} | Lab Acrílicos`;
   
   return (
     <Helmet>
       <title>{fullTitle}</title>
       <meta name="description" content={description} />
       {noindex && <meta name="robots" content="noindex, nofollow" />}
       {canonical && <link rel="canonical" href={`${BASE_URL}${canonical}`} />}
       
       {/* Open Graph */}
       <meta property="og:title" content={fullTitle} />
       <meta property="og:description" content={description} />
       <meta property="og:image" content={ogImage} />
       <meta property="og:type" content="website" />
       {canonical && <meta property="og:url" content={`${BASE_URL}${canonical}`} />}
       
       {/* Twitter */}
       <meta name="twitter:card" content="summary_large_image" />
       <meta name="twitter:title" content={fullTitle} />
       <meta name="twitter:description" content={description} />
       <meta name="twitter:image" content={ogImage} />
       
       {/* Schema.org JSON-LD */}
       {schema && (
         <script type="application/ld+json">
           {JSON.stringify(schema)}
         </script>
       )}
     </Helmet>
   );
 }
 
 // Helper para criar BreadcrumbSchema
 export function createBreadcrumbSchema(items: { name: string; url?: string }[]) {
   return {
     "@context": "https://schema.org",
     "@type": "BreadcrumbList",
     itemListElement: items.map((item, index) => ({
       "@type": "ListItem",
       position: index + 1,
       name: item.name,
       ...(item.url && { item: `https://labacrilicos.com.br${item.url}` }),
     })),
   };
 }
 
 // Helper para criar ProductSchema
 export function createProductSchema(product: {
   name: string;
   description: string;
   image?: string;
   brand?: string;
 }) {
   return {
     "@context": "https://schema.org",
     "@type": "Product",
     name: product.name,
     description: product.description,
     brand: {
       "@type": "Brand",
       name: product.brand || "Lab Acrílicos",
     },
     ...(product.image && { image: product.image }),
     offers: {
       "@type": "AggregateOffer",
       priceCurrency: "BRL",
       availability: "https://schema.org/InStock",
       seller: {
         "@type": "Organization",
         name: "Lab Acrílicos",
       },
     },
   };
 }
 
 // FAQ Schema helper
 export function createFAQSchema(faqs: { question: string; answer: string }[]) {
   return {
     "@context": "https://schema.org",
     "@type": "FAQPage",
     mainEntity: faqs.map((faq) => ({
       "@type": "Question",
       name: faq.question,
       acceptedAnswer: {
         "@type": "Answer",
         text: faq.answer,
       },
     })),
   };
 }