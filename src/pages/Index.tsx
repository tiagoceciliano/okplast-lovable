import { Link } from "react-router-dom";
import { ArrowRight, CheckCircle, Phone, Award, DollarSign, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { COMPANY } from "@/lib/constants";
import { DecorativeDivider } from "@/components/ui/DecorativeDivider";
import { BlueBanner } from "@/components/ui/BlueBanner";
import { TestimonialCard } from "@/components/ui/TestimonialCard";
import { useWhatsAppModal } from "@/contexts/WhatsAppModalContext";

import { HeroSection } from "@/components/home/HeroSection";
import { SEOHead, createFAQSchema } from "@/components/SEOHead";
import { MotivosCarousel } from "@/components/home/MotivosCarousel";

// Imagens locais das chapas
import imgAcrilicoTransparente from "@/assets/chapas-hero/acrilico-transparente.jpg";
import imgAcrilicoColorido from "@/assets/chapas-hero/acrilico-colorido.jpg";
import imgPetg from "@/assets/chapas-hero/petg.jpg";
import imgPoliestireno from "@/assets/chapas-hero/poliestireno.jpg";
import imgPolicarbonatoAlveolar from "@/assets/chapas-hero/policarbonato-alveolar.jpg";
import imgPolicarbonatoCompacto from "@/assets/chapas-hero/policarbonato-compacto.jpg";
import imgPvcExpandido from "@/assets/chapas-hero/pvc-expandido.jpg";
import imgAcm from "@/assets/chapas-hero/acm.jpg";

// LocalBusiness Schema para SEO local
const localBusinessSchema = {
  "@context": "https://schema.org",
  "@type": "LocalBusiness",
  "name": "OK Plast",
  "description": "Distribuidora de chapas plásticas no Rio de Janeiro. Acrílico, Policarbonato, PETG, Poliestireno, PVC e ACM. Corte sob medida.",
  "image": "https://okplast.com.br/og-image.jpg",
  "address": {
    "@type": "PostalAddress",
    "streetAddress": "Rua Guatemala, 593 - Penha Circular",
    "addressLocality": "Rio de Janeiro",
    "addressRegion": "RJ",
    "postalCode": "21020-170",
    "addressCountry": "BR"
  },
  "geo": {
    "@type": "GeoCoordinates",
    "latitude": -22.8380,
    "longitude": -43.2670
  },
  "telephone": "(21) 3372-3797",
  "email": "vendas@okplast.com.br",
  "url": "https://okplast.com.br",
  "openingHoursSpecification": {
    "@type": "OpeningHoursSpecification",
    "dayOfWeek": ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
    "opens": "09:00",
    "closes": "17:00"
  },
  "priceRange": "$$",
  "paymentAccepted": "Dinheiro, Cartão de Crédito, Pix, Boleto",
  "areaServed": {
    "@type": "Country",
    "name": "Brasil"
  }
};

// FAQ para Schema
const faqItems = [{
  question: "Quais tipos de chapas a OK Plast trabalha?",
  answer: "Trabalhamos com Acrílico (cristal, colorido, leitoso), Policarbonato alveolar e compacto, PETG, Poliestireno (PS), PVC Expandido e ACM."
}, {
  question: "Vocês fazem corte de chapas sob medida?",
  answer: "Sim! Cortamos chapas em qualquer medida que você precisar."
}, {
  question: "Como solicitar um orçamento?",
  answer: "Você pode solicitar orçamento pelo WhatsApp, e-mail ou formulário do site. Resposta em até 24 horas úteis."
}, {
  question: "Vocês fazem entrega?",
  answer: "Sim, fazemos entrega no Rio de Janeiro. Consulte as opções disponíveis para sua região."
}];

// Tipos de Chapas - Grid de 8 chapas (foco da home)
const tiposChapas = [
  { nome: "Acrílico Transparente", imageUrl: imgAcrilicoTransparente, href: "/chapas/acrilico" },
  { nome: "Acrílico Colorido", imageUrl: imgAcrilicoColorido, href: "/chapas/acrilico" },
  { nome: "PETG", imageUrl: imgPetg, href: "/chapas/petg" },
  { nome: "PS Poliestireno", imageUrl: imgPoliestireno, href: "/chapas/poliestireno" },
  { nome: "Policarbonato Alveolar", imageUrl: imgPolicarbonatoAlveolar, href: "/chapas/policarbonato-alveolar" },
  { nome: "Policarbonato Compacto", imageUrl: imgPolicarbonatoCompacto, href: "/chapas/policarbonato-compacto" },
  { nome: "PVC Expandido", imageUrl: imgPvcExpandido, href: "/chapas/pvc-expandido" },
  { nome: "ACM", imageUrl: imgAcm, href: "/chapas/acm" },
];

// Depoimentos
const depoimentos = [
  { nome: "Carlos Silva", empresa: "Comunicação Visual", texto: "Excelente qualidade nas chapas e atendimento impecável. Sempre entregam no prazo!", avatarUrl: "" },
  { nome: "Ana Paula", empresa: "Arquitetura Interior", texto: "As chapas de policarbonato ficaram perfeitas no projeto. Preço justo e qualidade top.", avatarUrl: "" },
  { nome: "Roberto Santos", empresa: "Serralheria", texto: "Trabalho com a OK Plast há anos. Sempre entregam no prazo e com qualidade impecável.", avatarUrl: "" },
  { nome: "Maria Fernanda", empresa: "Loja de Decoração", texto: "As chapas de acrílico são de primeira. Atendimento excepcional desde o primeiro contato!", avatarUrl: "" }
];

// Benefícios
const beneficios = [
  { icon: Phone, titulo: "Contato Rápido", desc: "Resposta em até 24 horas" },
  { icon: Award, titulo: "Chapas de Alta Qualidade", desc: "Materiais de primeira linha" },
  { icon: DollarSign, titulo: "Melhor Preço", desc: "Direto da distribuidora" }
];

export default function Index() {
  const { openWhatsAppModal } = useWhatsAppModal();
  const { openEmailModal } = useEmailQuoteModal();

  return (
    <>
      <SEOHead
        title="OK Plast | Distribuidora de Chapas Plásticas no RJ"
        description="Distribuidora de chapas: Acrílico, Policarbonato, PETG, Poliestireno, PVC Expandido e ACM. Corte sob medida. Melhor preço do Rio de Janeiro. Orçamento em 24h."
        canonical="/"
        schema={{
          "@context": "https://schema.org",
          "@graph": [localBusinessSchema, createFAQSchema(faqItems)]
        }}
      />

      <HeroSection onWhatsAppClick={() => openWhatsAppModal()} onEmailClick={() => openEmailModal()} />

      {/* CHAPAS - Grid principal */}
      <section className="section-padding">
        <div className="container-custom">
          <div className="text-center mb-10">
            <h2 className="font-bold text-2xl md:text-3xl lg:text-4xl text-accent uppercase tracking-wide">
              Chapas Inteiras e Cortadas
            </h2>
            <p className="text-muted-foreground mt-2">
              Acrílico, Policarbonato, PS, PETG, PVC Expandido e ACM — vendemos inteira ou cortamos sob medida
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
            {tiposChapas.map((chapa, index) => (
              <Link key={index} to={chapa.href} className="group">
                <div className="bg-background rounded-lg overflow-hidden shadow-sm border hover:shadow-md transition-shadow">
                  <div className="aspect-square bg-muted overflow-hidden">
                    <img
                      src={chapa.imageUrl}
                      alt={`Chapa de ${chapa.nome} - OK Plast`}
                      width={400}
                      height={400}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      loading={index < 4 ? "eager" : "lazy"}
                      decoding={index < 4 ? "sync" : "async"}
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
              Descubra por que somos a escolha certa para suas chapas plásticas
            </p>
          </div>
          <MotivosCarousel />
        </div>
      </section>

      {/* Depoimentos */}
      <section className="section-padding bg-secondary">
        <DecorativeDivider />
        <div className="container-custom">
          <div className="text-center mb-12">
            <h2 className="font-bold text-2xl md:text-3xl text-foreground mb-4">Satisfação Garantida</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">Veja as opiniões de nossos clientes</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {depoimentos.map((dep, index) => (
              <TestimonialCard key={index} nome={dep.nome} empresa={dep.empresa} texto={dep.texto} avatarUrl={dep.avatarUrl} />
            ))}
          </div>
        </div>
      </section>

      {/* CTA Final */}
      <section className="section-padding bg-primary text-primary-foreground">
        <div className="container-custom text-center">
          <h2 className="font-bold text-2xl md:text-3xl mb-4">Pronto para seu Orçamento?</h2>
          <p className="text-primary-foreground/90 mb-8 max-w-2xl mx-auto">
            Entre em contato conosco e solicite um orçamento personalizado. Nossa equipe está pronta para atender você!
          </p>
          <div className="flex flex-col items-center gap-4">
            <Button size="lg" className="btn-whatsapp text-lg px-8 py-6" onClick={() => openWhatsAppModal()}>
              <MessageCircle className="h-5 w-5 mr-2" />
              Orçamento via WhatsApp
            </Button>
            <button onClick={() => openEmailModal()} className="text-primary-foreground/70 hover:text-primary-foreground text-sm underline underline-offset-4">
              Prefere orçamento via e-mail?
            </button>
          </div>
        </div>
      </section>

      {/* Por que escolher */}
      <section className="section-padding bg-secondary">
        <div className="container-custom">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
            <div>
              <h2 className="font-bold text-2xl md:text-3xl text-foreground mb-8">
                Por que escolher a {COMPANY.name}?
              </h2>
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
