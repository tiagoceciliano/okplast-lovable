import { lazy, Suspense } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, CheckCircle, Phone, Award, DollarSign, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { COMPANY } from "@/lib/constants";
import { DecorativeDivider } from "@/components/ui/DecorativeDivider";
import { BlueBanner } from "@/components/ui/BlueBanner";
import { useWhatsAppModal } from "@/contexts/WhatsAppModalContext";

import { HeroSection } from "@/components/home/HeroSection";
import { SEOHead, createFAQSchema } from "@/components/SEOHead";

// Seções abaixo da dobra — carregadas sob demanda para liberar o thread
// principal e melhorar o Speed Index
const MotivosCarousel = lazy(() =>
  import("@/components/home/MotivosCarousel").then((m) => ({ default: m.MotivosCarousel }))
);
const TestimonialCard = lazy(() =>
  import("@/components/ui/TestimonialCard").then((m) => ({ default: m.TestimonialCard }))
);
const FAQSection = lazy(() =>
  import("@/components/seo/FAQSection").then((m) => ({ default: m.FAQSection }))
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
  telephone: "+5521923679387",
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

// Benefícios
const beneficios = [
  { icon: Phone, titulo: "Contato Rápido", desc: "Resposta em até 24 horas" },
  { icon: Award, titulo: "Chapas de Alta Qualidade", desc: "Materiais de primeira linha" },
  { icon: DollarSign, titulo: "Melhor Preço do RJ", desc: "Direto da distribuidora" },
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
                <div className="bg-background rounded-lg overflow-hidden shadow-sm border hover:shadow-md transition-shadow">
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
      <BlueBanner>
        {COMPANY.name} — sua distribuidora de chapas plásticas com o melhor preço do Rio de Janeiro.
      </BlueBanner>

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
          <Suspense fallback={<div className="min-h-[300px]" />}>
            <MotivosCarousel />
          </Suspense>
        </div>
      </section>

      {/* Depoimentos */}
      <section className="section-padding bg-secondary">
        <DecorativeDivider />
        <div className="container-custom">
          <div className="text-center mb-12">
            <h2 className="font-bold text-2xl md:text-3xl text-foreground mb-4">Satisfação Garantida</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Veja as opiniões de nossos clientes no Rio de Janeiro
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Suspense fallback={<div className="min-h-[200px]" />}>
              {depoimentos.map((dep, index) => (
                <TestimonialCard
                  key={index}
                  nome={dep.nome}
                  empresa={dep.empresa}
                  texto={dep.texto}
                  avatarUrl={dep.avatarUrl}
                />
              ))}
            </Suspense>
          </div>
        </div>
      </section>

      {/* FAQ Visível */}
      <Suspense fallback={<div className="min-h-[200px]" />}>
        <FAQSection faqs={faqItems} title="Perguntas Frequentes sobre Chapas Plásticas no RJ" />
      </Suspense>

      {/* CTA Final */}
      <section className="section-padding bg-primary text-primary-foreground">
        <div className="container-custom text-center">
          <h2 className="font-bold text-2xl md:text-3xl mb-4">Pronto para seu Orçamento?</h2>
          <p className="text-primary-foreground/90 mb-8 max-w-2xl mx-auto">
            Entre em contato conosco e solicite um orçamento personalizado. Distribuidora de chapas plásticas no Rio de
            Janeiro com entrega rápida e melhor preço do RJ.
          </p>
          <div className="flex flex-col items-center gap-4">
            <Button size="lg" className="btn-whatsapp text-lg px-8 py-6" onClick={() => openWhatsAppModal()}>
              <MessageCircle className="h-5 w-5 mr-2" />
              Orçamento via WhatsApp
            </Button>
          </div>
        </div>
      </section>

      {/* Por que escolher */}
      <section className="section-padding bg-secondary">
        <div className="container-custom">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
            <div>
              <h2 className="font-bold text-2xl md:text-3xl text-foreground mb-8">
                Por que escolher a {COMPANY.name} no Rio de Janeiro?
              </h2>
              <p className="text-muted-foreground mb-6">
                Somos uma distribuidora de chapas plásticas localizada em Penha Circular, Rio de Janeiro. Com anos de
                experiência no mercado carioca, oferecemos os melhores preços em acrílico, policarbonato, PETG,
                poliestireno, PVC expandido e ACM para todo o RJ e região metropolitana.
              </p>
              <div className="space-y-6 mb-8">
                {beneficios.map((beneficio, index) => (
                  <div key={index} className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-lg bg-accent/10 flex items-center justify-center shrink-0">
                      <beneficio.icon className="h-6 w-6 text-accent" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-foreground mb-1">{beneficio.titulo}</h3>
                      <p className="text-muted-foreground text-sm">{beneficio.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-accent shrink-0" />
                  <span className="text-sm">Atendimento Prioritário B2B</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-accent shrink-0" />
                  <span className="text-sm">Corte sob medida</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-accent shrink-0" />
                  <span className="text-sm">Entrega no RJ</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
