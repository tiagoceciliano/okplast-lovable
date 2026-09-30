import { lazy, Suspense } from "react";
import { Link } from "react-router-dom";
import { MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { COMPANY } from "@/lib/constants";
import { useWhatsAppModal } from "@/contexts/WhatsAppModalContext";

import { HeroSection } from "@/components/home/HeroSection";
import { SEOHead, createFAQSchema } from "@/components/SEOHead";
import { MountOnVisible } from "@/components/util/MountOnVisible";
// Abaixo da dobra — lazy para reduzir JS inicial (embla + accordion pesados).
const BlueBanner = lazy(() =>
  import("@/components/ui/BlueBanner").then((m) => ({ default: m.BlueBanner })),
);
const DecorativeDivider = lazy(() =>
  import("@/components/ui/DecorativeDivider").then((m) => ({ default: m.DecorativeDivider })),
);
const HomeBelowFold = lazy(() =>
  import("@/components/home/HomeBelowFold").then((m) => ({ default: m.HomeBelowFold })),
);
const MotivosCarousel = lazy(() =>
  import("@/components/home/MotivosCarousel").then((m) => ({ default: m.MotivosCarousel })),
);
const TestimonialCard = lazy(() =>
  import("@/components/ui/TestimonialCard").then((m) => ({ default: m.TestimonialCard })),
);
const FAQSection = lazy(() =>
  import("@/components/seo/FAQSection").then((m) => ({ default: m.FAQSection })),
);

// Imagens locais das chapas (WebP otimizado)
import imgAcrilicoTransparente from "@/assets/chapas-hero/acrilico-transparente.webp";
import imgAcrilicoColorido from "@/assets/chapas-hero/acrilico-colorido.webp";
import imgPetg from "@/assets/chapas-hero/petg.webp";
import imgPoliestireno from "@/assets/chapas-hero/poliestireno.webp";
import imgPolicarbonatoAlveolar from "@/assets/chapas-hero/policarbonato-alveolar.webp";
import imgPolicarbonatoCompacto from "@/assets/chapas-hero/policarbonato-compacto.webp";
import imgPvcExpandido from "@/assets/chapas-hero/pvc-expandido.webp";
import imgAcm from "@/assets/chapas-hero/acm.webp";

// LocalBusiness Schema para SEO local
const localBusinessSchema = {
  "@context": "https://schema.org",
  "@type": "LocalBusiness",
  "@id": "https://okplast.com.br/#organization",
  name: "OK Plast",
  alternateName: "OK Plast Distribuidora de Chapas",
  description:
    "Distribuidora de chapas no Rio de Janeiro. Acrílico, Policarbonato, PETG, Poliestireno, PVC e ACM. Corte sob medida. Atendemos todo o RJ.",
  image: "https://okplast.com.br/og-image.jpg",
  logo: "https://okplast.com.br/logo-horizontal.png",
  url: "https://okplast.com.br",
  telephone: "+5521923672701",
  email: "vendas@okplast.com.br",
  address: {
    "@type": "PostalAddress",
    streetAddress: "Rua Guatemala, 593 - Penha Circular",
    addressLocality: "Rio de Janeiro",
    addressRegion: "RJ",
    postalCode: "21020-170",
    addressCountry: "BR",
  },
  geo: {
    "@type": "GeoCoordinates",
    latitude: -22.838,
    longitude: -43.267,
  },
  hasMap: "https://maps.google.com/?q=Rua+Guatemala+593+Penha+Circular+Rio+de+Janeiro+RJ",
  openingHoursSpecification: [
    {
      "@type": "OpeningHoursSpecification",
      dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
      opens: "09:00",
      closes: "17:00",
    },
  ],
  priceRange: "$$",
  currenciesAccepted: "BRL",
  paymentAccepted: "Dinheiro, Cartão de Crédito, Cartão de Débito, Pix, Boleto, Transferência Bancária",
  areaServed: [
    { "@type": "State", name: "Rio de Janeiro" },
    { "@type": "City", name: "Rio de Janeiro" },
    { "@type": "City", name: "Niterói" },
    { "@type": "City", name: "São Gonçalo" },
    { "@type": "City", name: "Duque de Caxias" },
    { "@type": "City", name: "Nova Iguaçu" },
  ],
  sameAs: [],
  knowsAbout: [
    "Chapas de acrílico",
    "Chapas de policarbonato",
    "Chapas de PETG",
    "Chapas de poliestireno",
    "Chapas de PVC expandido",
    "Chapas de ACM",
    "Corte de chapas plásticas sob medida",
    "Distribuidora de plásticos no Rio de Janeiro",
  ],
  makesOffer: [
    {
      "@type": "Offer",
      itemOffered: { "@type": "Product", name: "Chapa de Acrílico" },
      areaServed: { "@type": "State", name: "Rio de Janeiro" },
    },
    {
      "@type": "Offer",
      itemOffered: { "@type": "Product", name: "Chapa de Policarbonato Alveolar" },
      areaServed: { "@type": "State", name: "Rio de Janeiro" },
    },
    {
      "@type": "Offer",
      itemOffered: { "@type": "Product", name: "Chapa de Policarbonato Compacto" },
      areaServed: { "@type": "State", name: "Rio de Janeiro" },
    },
    {
      "@type": "Offer",
      itemOffered: { "@type": "Product", name: "Chapa de PETG" },
      areaServed: { "@type": "State", name: "Rio de Janeiro" },
    },
    {
      "@type": "Offer",
      itemOffered: { "@type": "Product", name: "Chapa de Poliestireno" },
      areaServed: { "@type": "State", name: "Rio de Janeiro" },
    },
    {
      "@type": "Offer",
      itemOffered: { "@type": "Product", name: "Chapa de PVC Expandido" },
      areaServed: { "@type": "State", name: "Rio de Janeiro" },
    },
    {
      "@type": "Offer",
      itemOffered: { "@type": "Product", name: "Chapa de ACM" },
      areaServed: { "@type": "State", name: "Rio de Janeiro" },
    },
  ],
};

// FAQ para Schema + exibição visual
const faqItems = [
  {
    question: "Onde comprar chapas de acrílico no Rio de Janeiro?",
    answer:
      "A OK Plast é distribuidora de chapas de acrílico no RJ, localizada em Penha Circular. Trabalhamos com acrílico cristal, colorido, leitoso, espelhado e fumê, com corte sob medida e o melhor preço do Rio de Janeiro.",
  },
  {
    question: "Quais tipos de chapas plásticas a OK Plast trabalha?",
    answer:
      "Trabalhamos com Acrílico (cristal, colorido, leitoso), Policarbonato alveolar e compacto, PETG, Poliestireno (PS), PVC Expandido e ACM. Todos disponíveis com corte sob medida no Rio de Janeiro.",
  },
  {
    question: "Vocês fazem corte de chapas sob medida no RJ?",
    answer:
      "Sim! Cortamos chapas de acrílico, policarbonato, PETG, poliestireno, PVC e ACM em qualquer medida. Atendemos Rio de Janeiro e região metropolitana.",
  },
  {
    question: "Como solicitar um orçamento de chapas plásticas?",
    answer:
      "Você pode solicitar orçamento pelo WhatsApp, e-mail ou formulário do site. Resposta em até 24 horas úteis. Informe o tipo de chapa, espessura e dimensões desejadas.",
  },
  {
    question: "Vocês fazem entrega de chapas no Rio de Janeiro?",
    answer:
      "Sim, fazemos entrega de chapas plásticas em todo o Rio de Janeiro e região metropolitana. Consulte as opções de frete disponíveis para sua região.",
  },
];

// Tipos de Chapas - Grid de 8 chapas (foco da home)
const tiposChapas = [
  {
    nome: "Acrílico Transparente",
    imageUrl: imgAcrilicoTransparente,
    href: "/chapas/acrilico",
    alt: "Chapa de acrílico transparente no RJ - OK Plast distribuidora",
  },
  {
    nome: "Acrílico Colorido",
    imageUrl: imgAcrilicoColorido,
    href: "/chapas/acrilico",
    alt: "Chapas de acrílico colorido no Rio de Janeiro - OK Plast",
  },
  { nome: "PETG", imageUrl: imgPetg, href: "/chapas/petg", alt: "Chapa PETG no RJ - distribuidora OK Plast" },
  {
    nome: "PS Poliestireno",
    imageUrl: imgPoliestireno,
    href: "/chapas/poliestireno",
    alt: "Chapa de poliestireno PS no Rio de Janeiro - OK Plast",
  },
  {
    nome: "Policarbonato Alveolar",
    imageUrl: imgPolicarbonatoAlveolar,
    href: "/chapas/policarbonato-alveolar",
    alt: "Chapa de policarbonato alveolar no RJ - OK Plast",
  },
  {
    nome: "Policarbonato Compacto",
    imageUrl: imgPolicarbonatoCompacto,
    href: "/chapas/policarbonato-compacto",
    alt: "Chapa de policarbonato compacto no Rio de Janeiro - OK Plast",
  },
  {
    nome: "PVC Expandido",
    imageUrl: imgPvcExpandido,
    href: "/chapas/pvc-expandido",
    alt: "Chapa de PVC expandido no RJ - OK Plast distribuidora",
  },
  {
    nome: "ACM",
    imageUrl: imgAcm,
    href: "/chapas/acm",
    alt: "Chapa ACM alumínio composto no Rio de Janeiro - OK Plast",
  },
];

// Depoimentos
const depoimentos = [
  {
    nome: "Carlos Silva",
    empresa: "Comunicação Visual",
    texto: "Excelente qualidade nas chapas e atendimento impecável. Sempre entregam no prazo!",
    avatarUrl: "",
  },
  {
    nome: "Ana Paula",
    empresa: "Arquitetura Interior",
    texto: "As chapas de policarbonato ficaram perfeitas no projeto. Preço justo e qualidade top.",
    avatarUrl: "",
  },
  {
    nome: "Roberto Santos",
    empresa: "Serralheria",
    texto: "Trabalho com a OK Plast há anos. Sempre entregam no prazo e com qualidade impecável.",
    avatarUrl: "",
  },
  {
    nome: "Maria Fernanda",
    empresa: "Loja de Decoração",
    texto: "As chapas de acrílico são de primeira. Atendimento excepcional desde o primeiro contato!",
    avatarUrl: "",
  },
];

export default function Index() {
  const { openWhatsAppModal } = useWhatsAppModal();

  return (
    <>
      <SEOHead
        title="OK Plast | Distribuidora de Chapas Plásticas no RJ"
        description="Distribuidora de chapas plásticas no RJ: acrílico, policarbonato, PETG, PS, PVC e ACM. Corte sob medida e entrega rápida. Orçamento via WhatsApp."
        canonical="/"
        schema={{
          "@context": "https://schema.org",
          "@graph": [localBusinessSchema, createFAQSchema(faqItems)],
        }}
      />

      <HeroSection onWhatsAppClick={() => openWhatsAppModal()} />

      {/* CHAPAS - Grid principal */}
      <section className="section-padding">
        <div className="container-custom">
          <div className="text-center mb-10">
            <h2 className="font-bold text-2xl md:text-3xl lg:text-4xl text-accent uppercase tracking-wide">
            Chapas no Rio de Janeiro
            </h2>
            <p className="text-muted-foreground mt-2">
              Acrílico, Policarbonato, PS, PETG, PVC Expandido e ACM — vendemos inteira ou cortamos sob medida no RJ
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
            {tiposChapas.map((chapa, index) => (
              <Link key={index} to={chapa.href} className="group">
                <div className="bg-background rounded-lg overflow-hidden shadow-xs border hover:shadow-md transition-shadow">
                  <div className="aspect-square bg-muted overflow-hidden">
                    <img
                      src={chapa.imageUrl}
                      alt={chapa.alt}
                      width={400}
                      height={400}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      loading={index < 4 ? "eager" : "lazy"}
                      fetchPriority={index < 4 ? "low" : undefined}
                      decoding="async"
                      sizes="(min-width: 768px) 25vw, 50vw"
                    />
                  </div>
                  <div className="p-3 text-center">
                    <span className="text-sm font-medium text-foreground">{chapa.nome}</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>

          <div className="flex flex-col items-center gap-3 mt-8">
            <Button size="lg" className="btn-whatsapp gap-2" onClick={() => openWhatsAppModal("Chapa Inteira")}>
              <MessageCircle className="h-5 w-5" />
              Orçamento via WhatsApp
            </Button>
          </div>
        </div>
      </section>

      {/* Banner */}
      <MountOnVisible fallback={<div className="min-h-[80px]" />}>
        <Suspense fallback={<div className="min-h-[80px]" />}>
          <BlueBanner>
            {COMPANY.name} — sua distribuidora de chapas plásticas com o melhor preço do Rio de Janeiro.
          </BlueBanner>
        </Suspense>
      </MountOnVisible>

      {/* 6 Motivos */}
      <section className="section-padding">
        <div className="container-custom">
          <div className="text-center mb-12">
            <h2 className="font-bold text-2xl md:text-3xl text-foreground mb-4">
              6 Motivos para Escolher a {COMPANY.name}
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Descubra por que somos a distribuidora de chapas plásticas mais escolhida do Rio de Janeiro
            </p>
          </div>
          <MountOnVisible fallback={<div className="min-h-[280px]" />}>
            <Suspense fallback={<div className="min-h-[280px]" />}>
              <MotivosCarousel />
            </Suspense>
          </MountOnVisible>
        </div>
      </section>

      {/* Depoimentos */}
      <section className="section-padding bg-secondary">
        <MountOnVisible fallback={null}>
          <Suspense fallback={null}>
            <DecorativeDivider />
          </Suspense>
        </MountOnVisible>
        <div className="container-custom">
          <div className="text-center mb-12">
            <h2 className="font-bold text-2xl md:text-3xl text-foreground mb-4">Satisfação Garantida</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Veja as opiniões de nossos clientes no Rio de Janeiro
            </p>
          </div>
          <MountOnVisible fallback={<div className="min-h-[200px]" />}>
            <Suspense fallback={<div className="min-h-[200px]" />}>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {depoimentos.map((dep, index) => (
                  <TestimonialCard
                    key={index}
                    nome={dep.nome}
                    empresa={dep.empresa}
                    texto={dep.texto}
                    avatarUrl={dep.avatarUrl}
                  />
                ))}
              </div>
            </Suspense>
          </MountOnVisible>
        </div>
      </section>

      {/* FAQ Visível */}
      <MountOnVisible fallback={<div className="min-h-[400px]" />}>
        <Suspense fallback={<div className="min-h-[400px]" />}>
          <FAQSection faqs={faqItems} title="Perguntas Frequentes sobre Chapas Plásticas no RJ" />
        </Suspense>
      </MountOnVisible>

      <MountOnVisible fallback={<div className="min-h-[400px]" />}>
        <Suspense fallback={<div className="min-h-[400px]" />}>
          <HomeBelowFold onWhatsAppClick={() => openWhatsAppModal()} />
        </Suspense>
      </MountOnVisible>
    </>
  );
}
