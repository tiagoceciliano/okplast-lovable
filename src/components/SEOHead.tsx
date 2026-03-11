import { Helmet } from "react-helmet-async";

interface SEOHeadProps {
  title?: string;
  description?: string;
  canonical?: string;
  ogImage?: string;
  noindex?: boolean;
  schema?: object;
}

const BASE_URL = "https://okplast.com.br";
const DEFAULT_OG_IMAGE = `${BASE_URL}/og-image.jpg`;

export function SEOHead({
  title = "OK Plast | Distribuidora de Chapas Plásticas no Rio de Janeiro",
  description = "Distribuidora de chapas plásticas: Acrílico, Policarbonato, PETG, Poliestireno, PVC e ACM. Corte sob medida. Rio de Janeiro.",
  canonical,
  ogImage = DEFAULT_OG_IMAGE,
  noindex = false,
  schema,
}: SEOHeadProps) {
  const fullTitle = title.includes("OK Plast") ? title : `${title} | OK Plast`;
  
  return (
    <Helmet>
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      {noindex && <meta name="robots" content="noindex, nofollow" />}
      {canonical && <link rel="canonical" href={`${BASE_URL}${canonical}`} />}
      
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={ogImage} />
      <meta property="og:type" content="website" />
      {canonical && <meta property="og:url" content={`${BASE_URL}${canonical}`} />}
      
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={ogImage} />
      
      {schema && (
        <script type="application/ld+json">
          {JSON.stringify(schema)}
        </script>
      )}
    </Helmet>
  );
}

export function createBreadcrumbSchema(items: { name: string; url?: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      ...(item.url && { item: `https://okplast.com.br${item.url}` }),
    })),
  };
}

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
      name: product.brand || "OK Plast",
    },
    ...(product.image && { image: product.image }),
    offers: {
      "@type": "AggregateOffer",
      priceCurrency: "BRL",
      availability: "https://schema.org/InStock",
      seller: {
        "@type": "Organization",
        name: "OK Plast",
      },
    },
  };
}

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
