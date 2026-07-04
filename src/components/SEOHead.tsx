import { useEffect } from "react";

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

function upsertMeta(attr: "name" | "property", key: string, value: string) {
  let el = document.head.querySelector<HTMLMetaElement>(`meta[${attr}="${key}"]`);
  if (!el) {
    el = document.createElement("meta");
    el.setAttribute(attr, key);
    document.head.appendChild(el);
  }
  el.setAttribute("content", value);
  return el;
}

function upsertLink(rel: string, href: string) {
  let el = document.head.querySelector<HTMLLinkElement>(`link[rel="${rel}"]`);
  if (!el) {
    el = document.createElement("link");
    el.setAttribute("rel", rel);
    document.head.appendChild(el);
  }
  el.setAttribute("href", href);
  return el;
}

export function SEOHead({
  title = "OK Plast | Distribuidora de Chapas Plásticas no Rio de Janeiro",
  description = "Distribuidora de chapas plásticas: Acrílico, Policarbonato, PETG, Poliestireno, PVC e ACM. Corte sob medida. Rio de Janeiro.",
  canonical,
  ogImage = DEFAULT_OG_IMAGE,
  noindex = false,
  schema,
}: SEOHeadProps) {
  const fullTitle = title.includes("OK Plast") ? title : `${title} | OK Plast`;

  useEffect(() => {
    document.title = fullTitle;
    upsertMeta("name", "description", description);
    upsertMeta("name", "robots", noindex ? "noindex, nofollow" : "index, follow");

    upsertMeta("property", "og:title", fullTitle);
    upsertMeta("property", "og:description", description);
    upsertMeta("property", "og:image", ogImage);
    upsertMeta("property", "og:type", "website");

    upsertMeta("name", "twitter:card", "summary_large_image");
    upsertMeta("name", "twitter:title", fullTitle);
    upsertMeta("name", "twitter:description", description);
    upsertMeta("name", "twitter:image", ogImage);

    if (canonical) {
      const url = `${BASE_URL}${canonical}`;
      upsertLink("canonical", url);
      upsertMeta("property", "og:url", url);
    }

    let schemaEl: HTMLScriptElement | null = null;
    if (schema) {
      schemaEl = document.createElement("script");
      schemaEl.type = "application/ld+json";
      schemaEl.setAttribute("data-seohead", "1");
      schemaEl.textContent = JSON.stringify(schema);
      // Remove qualquer schema anterior injetado por este componente
      document.head
        .querySelectorAll('script[type="application/ld+json"][data-seohead="1"]')
        .forEach((n) => n.remove());
      document.head.appendChild(schemaEl);
    }
    return () => {
      if (schemaEl && schemaEl.parentNode) schemaEl.parentNode.removeChild(schemaEl);
    };
  }, [fullTitle, description, canonical, ogImage, noindex, schema]);

  return null;
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
