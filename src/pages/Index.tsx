import { Link } from "react-router-dom";
import { ArrowRight, CheckCircle, Phone, Award, DollarSign, ShoppingCart, MessageCircle, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import { COMPANY } from "@/lib/constants";
import { DecorativeDivider } from "@/components/ui/DecorativeDivider";
import { BlueBanner } from "@/components/ui/BlueBanner";
import { TestimonialCard } from "@/components/ui/TestimonialCard";
import { ClientLogos } from "@/components/ui/ClientLogos";
import { GoogleMapEmbed } from "@/components/ui/GoogleMapEmbed";
import { useWhatsAppModal } from "@/contexts/WhatsAppModalContext";
import { useEmailQuoteModal } from "@/contexts/EmailQuoteModalContext";
import { MotivosCarousel } from "@/components/home/MotivosCarousel";
import { PRODUTOS_IMAGES, CHAPAS_IMAGES, DEPOIMENTOS_IMAGES } from "@/lib/images";

// Produtos Sob Medida - Grid de 8 produtos
const produtosSobMedida = [
  // Linha 1
  { nome: "Cúpulas e Redomas", imageUrl: PRODUTOS_IMAGES.cupulasRedomas },
  { nome: "Troféus", imageUrl: PRODUTOS_IMAGES.trofeus },
  { nome: "Medalhas e Premiações", imageUrl: PRODUTOS_IMAGES.medalhasPremiacoes },
  { nome: "Expositores Sob medida", imageUrl: PRODUTOS_IMAGES.potesDoces },
  // Linha 2
  { nome: "Display A4 Parede", imageUrl: PRODUTOS_IMAGES.displayA4Parede },
  { nome: "Display A6 Mesa", imageUrl: PRODUTOS_IMAGES.displayA6Mesa },
  { nome: "Urna Piramidal", imageUrl: PRODUTOS_IMAGES.urnaPiramidal },
  { nome: "Púlpitos", imageUrl: PRODUTOS_IMAGES.caixasSobMedida },
  // Linha 3
  { nome: "Caixa para Doces", imageUrl: PRODUTOS_IMAGES.caixaDoces },
  { nome: "Pote a Granel", imageUrl: PRODUTOS_IMAGES.poteAGranel },
  { nome: "Defletores", imageUrl: PRODUTOS_IMAGES.portaFolder },
  { nome: "Placas Personalizadas", imageUrl: PRODUTOS_IMAGES.placasPersonalizadas },
];

// Tipos de Chapas - Grid de 8 chapas
const tiposChapas = [{
  nome: "Acrílico Transparente",
  imageUrl: CHAPAS_IMAGES.acrilicoCristal
}, {
  nome: "Acrílico Colorido",
  imageUrl: CHAPAS_IMAGES.acrilicoColorido
}, {
  nome: "Pet G",
  imageUrl: CHAPAS_IMAGES.petg
}, {
  nome: "PS Poliestireno",
  imageUrl: CHAPAS_IMAGES.acrilicoLeitoso
}, {
  nome: "Policarbonato Alveolar",
  imageUrl: CHAPAS_IMAGES.policarbonato
}, {
  nome: "Policarbonato Compacto",
  imageUrl: CHAPAS_IMAGES.acrilicoEspelhado
}, {
  nome: "PVC Expandido",
  imageUrl: CHAPAS_IMAGES.pvcExpandido
}, {
  nome: "ACM",
  imageUrl: CHAPAS_IMAGES.pedacosRetalhos
}];

// Depoimentos
const depoimentos = [{
  nome: "Carlos Silva",
  empresa: "Loja de Bijuterias",
  texto: "Excelente qualidade nos expositores. Minha loja ficou muito mais organizada e bonita!",
  avatarUrl: DEPOIMENTOS_IMAGES.avatar1
}, {
  nome: "Ana Paula",
  empresa: "Confeitaria Doce Sabor",
  texto: "Os potes de acrílico são perfeitos para expor os doces. Clientes elogiam muito!",
  avatarUrl: DEPOIMENTOS_IMAGES.avatar2
}, {
  nome: "Roberto Santos",
  empresa: "Arquiteto",
  texto: "Trabalho com a Lab Acrílicos há anos. Sempre entregam no prazo e com qualidade impecável.",
  avatarUrl: DEPOIMENTOS_IMAGES.avatar3
}, {
  nome: "Maria Fernanda",
  empresa: "Joalheria Elegance",
  texto: "Os displays valorizaram muito nossas peças. Atendimento excepcional desde o primeiro contato!",
  avatarUrl: DEPOIMENTOS_IMAGES.avatar4
}];

// Benefícios
const beneficios = [{
  icon: Phone,
  titulo: "Contato Rápido",
  desc: "Resposta em até 24 horas"
}, {
  icon: Award,
  titulo: "Produtos de Alta Qualidade",
  desc: "Acrílico 100% virgem"
}, {
  icon: DollarSign,
  titulo: "Melhor Preço",
  desc: "Direto da fábrica"
}];
export default function Index() {
  const {
    openWhatsAppModal
  } = useWhatsAppModal();
  const {
    openEmailModal
  } = useEmailQuoteModal();
  return <>
      {/* Hero Section */}
      <section className="bg-background py-12 md:py-16 lg:py-20">
        <div className="container-custom">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="font-bold text-3xl md:text-4xl lg:text-5xl text-foreground mb-6 leading-tight">
              FÁBRICA e LOJA DE CHAPAS DE{" "}
              <span className="text-accent">ACRÍLICO</span> e PERSONALIZADOS.
            </h1>
            <p className="text-lg md:text-xl text-accent font-medium mb-6">
              Acrílico Transparente e Colorido, PS, Policarbonato, PETG, PVC e muito mais.
            </p>
            <p className="text-muted-foreground mb-8 max-w-2xl mx-auto">
              A <strong className="text-foreground">{COMPANY.name}</strong> é especializada na fabricação e venda de chapas de acrílico e produtos personalizados. 
              Há mais de 30 anos oferecendo qualidade, inovação e as melhores soluções em acrílico.
            </p>
            <div className="flex flex-col items-center gap-4">
              <Button size="lg" className="btn-whatsapp text-lg px-8 py-6" onClick={() => openWhatsAppModal()}>
                <MessageCircle className="h-5 w-5 mr-2" />
                Orçamento via WhatsApp
              </Button>
              <button onClick={() => openEmailModal()} className="text-muted-foreground hover:text-foreground text-sm underline underline-offset-4">
                Prefere orçamento via e-mail?
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* LINHA 1: PRODUTOS SOB MEDIDA */}
      <section className="section-padding bg-secondary">
        <div className="container-custom">
          <div className="text-center mb-10">
            <h2 className="font-bold text-2xl md:text-3xl lg:text-4xl text-accent uppercase tracking-wide">
              Produtos Sob Medida
            </h2>
            <p className="text-muted-foreground mt-2">
              Fabricamos produtos personalizados em acrílico de alta qualidade
            </p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
            {produtosSobMedida.map((produto, index) => <div key={index} className="bg-background rounded-lg overflow-hidden shadow-sm">
                <div className="aspect-square bg-muted overflow-hidden">
                  <img src={produto.imageUrl} alt={produto.nome} className="w-full h-full object-cover" loading="lazy" />
                </div>
                <div className="p-3 text-center">
                  <span className="text-sm font-medium text-foreground">{produto.nome}</span>
                </div>
              </div>)}
          </div>
          
          <div className="text-center mt-8">
            <Button size="lg" asChild className="gap-2">
              <Link to="/acrilico-sob-medida" onClick={() => window.scrollTo(0, 0)}>
                Ver mais produtos
                <ShoppingCart className="h-5 w-5" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* LINHA 2: CHAPAS E PEDAÇOS DE PLACAS */}
      <section className="section-padding">
        <div className="container-custom">
          <div className="text-center mb-10">
            <h2 className="font-bold text-2xl md:text-3xl lg:text-4xl text-accent uppercase tracking-wide">
              Chapas Inteiras e Cortadas   
            </h2>
            <p className="text-muted-foreground mt-2">
              Acrílico Transparente e Colorido, PS, Policarbonato, PETG, PVC e muito mais.
            </p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
            {tiposChapas.map((chapa, index) => <div key={index} className="bg-background rounded-lg overflow-hidden shadow-sm border">
                <div className="aspect-square bg-muted overflow-hidden">
                  <img src={chapa.imageUrl} alt={chapa.nome} className="w-full h-full object-cover" loading="lazy" />
                </div>
                <div className="p-3 text-center">
                  <span className="text-sm font-medium text-foreground">{chapa.nome}</span>
                </div>
              </div>)}
          </div>
          
          <div className="text-center mt-8">
            <Button size="lg" variant="outline" asChild className="gap-2">
              <Link to="/chapas-de-acrilico">
                Ver mais chapas e materiais
                <ArrowRight className="h-5 w-5" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Banner Azul */}
      <BlueBanner>
        {COMPANY.name} é sua casa do acrílico com o melhor preço da região entre todas as lojas de acrílicos.
      </BlueBanner>

      {/* 6 Motivos - Carrossel */}
      <section className="section-padding">
        <div className="container-custom">
          <div className="text-center mb-12">
            <h2 className="font-bold text-2xl md:text-3xl text-foreground mb-4">
              6 Motivos para Escolher a {COMPANY.name}
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Descubra por que somos a escolha certa para seu projeto em acrílico
            </p>
          </div>
          
          <MotivosCarousel />
        </div>
      </section>

      {/* Satisfação Garantida - Depoimentos */}
      <section className="section-padding bg-secondary">
        <div className="container-custom">
          <DecorativeDivider />
          
          <div className="text-center mb-12">
            <h2 className="font-bold text-2xl md:text-3xl text-foreground mb-4">
              Satisfação Garantida
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Veja as opiniões de nossos clientes
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {depoimentos.map((dep, index) => <TestimonialCard key={index} nome={dep.nome} empresa={dep.empresa} texto={dep.texto} avatarUrl={dep.avatarUrl} />)}
          </div>
        </div>
      </section>

      {/* Grande Empresa, Grandes Clientes */}
      <section className="section-padding">
        <div className="container-custom">
          <div className="text-center mb-12">
            <h2 className="font-bold text-2xl md:text-3xl text-foreground mb-4">
              Grande Empresa, Grandes Clientes
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              A {COMPANY.name} atende desde pequenos empreendedores até grandes corporações
            </p>
          </div>
          
          <ClientLogos />
        </div>
      </section>

      {/* Orçamento + Mapa */}
      <section className="section-padding bg-secondary">
        <div className="container-custom">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
            {/* Left - Benefits */}
            <div>
              <h2 className="font-bold text-2xl md:text-3xl text-foreground mb-8">
                Por que escolher a {COMPANY.name}?
              </h2>
              
              <div className="space-y-6 mb-8">
                {beneficios.map((beneficio, index) => <div key={index} className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-lg bg-accent/10 flex items-center justify-center shrink-0">
                      <beneficio.icon className="h-6 w-6 text-accent" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-foreground mb-1">{beneficio.titulo}</h3>
                      <p className="text-muted-foreground text-sm">{beneficio.desc}</p>
                    </div>
                  </div>)}
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-accent shrink-0" />
                  <span className="text-sm">Atendimento Prioritário B2B</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-accent shrink-0" />
                  <span className="text-sm">Projetos sob encomenda</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-accent shrink-0" />
                  <span className="text-sm">Entrega nacional</span>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* CTA Final */}
      <section className="section-padding bg-primary text-primary-foreground">
        <div className="container-custom text-center">
          <h2 className="font-bold text-2xl md:text-3xl mb-4">
            Pronto para Começar seu Projeto?
          </h2>
          <p className="text-primary-foreground/90 mb-8 max-w-2xl mx-auto">
            Entre em contato conosco e solicite um orçamento personalizado. 
            Nossa equipe está pronta para atender você!
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
    </>;
}