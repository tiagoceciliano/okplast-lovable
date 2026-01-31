import { Link } from "react-router-dom";
import { ArrowRight, CheckCircle, Phone, Award, DollarSign } from "lucide-react";
import { Button } from "@/components/ui/button";
import { COMPANY } from "@/lib/constants";
import { DecorativeDivider } from "@/components/ui/DecorativeDivider";
import { BlueBanner } from "@/components/ui/BlueBanner";
import { TestimonialCard } from "@/components/ui/TestimonialCard";
import { ClientLogos } from "@/components/ui/ClientLogos";
import { GoogleMapEmbed } from "@/components/ui/GoogleMapEmbed";

import { MotivosCarousel } from "@/components/home/MotivosCarousel";
import { ProductCategoryGrid } from "@/components/home/ProductCategoryGrid";
import { PRODUTOS_IMAGES, CHAPAS_IMAGES, DEPOIMENTOS_IMAGES, EMPRESA_IMAGES } from "@/lib/images";

// Produtos Sob Medida - Ordem conforme layout Acrilzano (2 linhas de 4)
const produtosSobMedida = [
  // Linha 1
  { nome: "Potes para Doces", href: "/acrilico-sob-medida/potes-para-doces-e-guloseimas", imageUrl: PRODUTOS_IMAGES.potesDoces },
  { nome: "Cúpulas e Redomas", href: "/acrilico-sob-medida/cupulas-e-redomas", imageUrl: PRODUTOS_IMAGES.cupulasRedomas },
  { nome: "Display de Acrílico", href: "/acrilico-sob-medida/display-de-acrilico", imageUrl: PRODUTOS_IMAGES.display },
  { nome: "Porta Folder", href: "/acrilico-sob-medida/porta-folder", imageUrl: PRODUTOS_IMAGES.portaFolder },
  // Linha 2
  { nome: "Potes para Grãos", href: "/acrilico-sob-medida/potes-para-graos-e-cereais", imageUrl: PRODUTOS_IMAGES.potesGraos },
  { nome: "Urna de Acrílico", href: "/acrilico-sob-medida/urna-de-acrilico", imageUrl: PRODUTOS_IMAGES.urna },
  { nome: "Caixas Sob Medida", href: "/acrilico-sob-medida/caixas-sob-medida", imageUrl: PRODUTOS_IMAGES.caixasSobMedida },
  { nome: "Troféus", href: "/acrilico-sob-medida/trofeus-personalizados", imageUrl: PRODUTOS_IMAGES.trofeus },
];

// Tipos de Chapas
const tiposChapas = [
  { nome: "Acrílico Cristal", href: "/chapas-de-acrilico", imageUrl: CHAPAS_IMAGES.acrilicoCristal },
  { nome: "Acrílico Colorido", href: "/chapas-de-acrilico", imageUrl: CHAPAS_IMAGES.acrilicoColorido },
  { nome: "Acrílico Leitoso", href: "/chapas-de-acrilico", imageUrl: CHAPAS_IMAGES.acrilicoLeitoso },
  { nome: "Acrílico Espelhado", href: "/chapas-de-acrilico", imageUrl: CHAPAS_IMAGES.acrilicoEspelhado },
  { nome: "Policarbonato", href: "/chapas-de-acrilico", imageUrl: CHAPAS_IMAGES.policarbonato },
  { nome: "PETG", href: "/chapas-de-acrilico", imageUrl: CHAPAS_IMAGES.petg },
  { nome: "PVC Expandido", href: "/chapas-de-acrilico", imageUrl: CHAPAS_IMAGES.pvcExpandido },
  { nome: "Pedaços e Retalhos", href: "/chapas-de-acrilico", imageUrl: CHAPAS_IMAGES.pedacosRetalhos },
];

// Depoimentos
const depoimentos = [
  { nome: "Carlos Silva", empresa: "Loja de Bijuterias", texto: "Excelente qualidade nos expositores. Minha loja ficou muito mais organizada e bonita!", avatarUrl: DEPOIMENTOS_IMAGES.avatar1 },
  { nome: "Ana Paula", empresa: "Confeitaria Doce Sabor", texto: "Os potes de acrílico são perfeitos para expor os doces. Clientes elogiam muito!", avatarUrl: DEPOIMENTOS_IMAGES.avatar2 },
  { nome: "Roberto Santos", empresa: "Arquiteto", texto: "Trabalho com a Lab Acrílicos há anos. Sempre entregam no prazo e com qualidade impecável.", avatarUrl: DEPOIMENTOS_IMAGES.avatar3 },
  { nome: "Maria Fernanda", empresa: "Joalheria Elegance", texto: "Os displays valorizaram muito nossas peças. Atendimento excepcional desde o primeiro contato!", avatarUrl: DEPOIMENTOS_IMAGES.avatar4 },
];

// Benefícios
const beneficios = [
  { icon: Phone, titulo: "Contato Rápido", desc: "Resposta em até 24 horas" },
  { icon: Award, titulo: "Produtos de Alta Qualidade", desc: "Acrílico 100% virgem" },
  { icon: DollarSign, titulo: "Melhor Preço", desc: "Direto da fábrica" },
];

export default function Index() {
  return (
    <>
      {/* Hero Section - 2 Columns */}
      <section className="bg-background py-12 md:py-16 lg:py-20">
        <div className="container-custom">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
            {/* Left Column - Text */}
            <div>
              <h1 className="font-bold text-3xl md:text-4xl lg:text-5xl text-foreground mb-6 leading-tight">
                FÁBRICA e LOJA DE CHAPAS DE{" "}
                <span className="text-accent">ACRÍLICO</span> e PERSONALIZADOS.
              </h1>
              <p className="text-lg md:text-xl text-accent font-medium mb-6">
                Acrílico Transparente e Colorido, PS, Policarbonato, PETG, PVC e muito mais.
              </p>
              <p className="text-muted-foreground mb-8">
                A <strong className="text-foreground">{COMPANY.name}</strong> é especializada na fabricação e venda de chapas de acrílico e produtos personalizados. 
                Há mais de 30 anos oferecendo qualidade, inovação e as melhores soluções em acrílico para empresas e consumidores de todo o Brasil.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button size="lg" asChild>
                  <Link to="/home/orcamento">
                    Solicitar Orçamento
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Link>
                </Button>
                <Button size="lg" variant="outline" asChild>
                  <Link to="/acrilico-sob-medida">Ver Produtos</Link>
                </Button>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Conheça Nossa Empresa */}
      <section className="section-padding bg-secondary">
        <div className="container-custom">
          <DecorativeDivider />
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
            {/* Foto da Equipe */}
            <div className="aspect-video bg-muted rounded-lg overflow-hidden">
              <img 
                src={EMPRESA_IMAGES.equipe} 
                alt="Equipe Lab Acrílicos" 
                className="w-full h-full object-cover"
                loading="lazy"
              />
            </div>

            <div>
              <h2 className="font-bold text-2xl md:text-3xl text-foreground mb-6">
                Conheça um pouco da nossa empresa
              </h2>
              <p className="text-muted-foreground mb-6">
                A {COMPANY.name} é uma empresa familiar que nasceu da paixão pelo trabalho com acrílico. 
                Ao longo de mais de três décadas, construímos uma reputação sólida baseada na qualidade, 
                no atendimento personalizado e na capacidade de transformar ideias em realidade.
              </p>
              <p className="text-muted-foreground mb-8">
                Nossa equipe de profissionais altamente qualificados está pronta para atender desde 
                pequenos projetos até grandes demandas corporativas, sempre com o mesmo compromisso: 
                excelência em cada detalhe.
              </p>
              <Button variant="outline" asChild>
                <Link to="/home/sobre-nos">
                  Conheça a Nossa História
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>
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
        </div>
      </section>

      {/* Produtos Sob Medida */}
      <section className="section-padding">
        <div className="container-custom">
          <div className="text-center mb-12">
            <h2 className="font-bold text-2xl md:text-3xl text-foreground mb-4 uppercase">
              Produtos Sob Medida
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Fabricamos produtos personalizados em acrílico de alta qualidade
            </p>
          </div>
          
          <ProductCategoryGrid
            title=""
            products={produtosSobMedida}
            columns={4}
          />
          
          <div className="text-center mt-8">
            <Button size="lg" variant="outline" asChild>
              <Link to="/acrilico-sob-medida">
                Ver mais produtos
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Chapas e Pedaços */}
      <section className="section-padding bg-primary text-primary-foreground">
        <div className="container-custom">
          <div className="text-center mb-12">
            <h2 className="font-bold text-2xl md:text-3xl mb-4 uppercase">
              Chapas e Pedaços de Placas
            </h2>
            <p className="text-primary-foreground/80 max-w-2xl mx-auto">
              Trabalhamos com diversos tipos de chapas de acrílico para atender projetos de todos os portes
            </p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {tiposChapas.map((chapa, index) => (
              <Link
                key={index}
                to={chapa.href}
                className="group relative aspect-[4/3] rounded-lg overflow-hidden"
              >
                <img 
                  src={chapa.imageUrl} 
                  alt={chapa.nome}
                  className="absolute inset-0 w-full h-full object-cover"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-black/40 group-hover:bg-black/50 transition-colors" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="font-semibold text-white text-center px-2 text-sm md:text-base">
                    {chapa.nome}
                  </span>
                </div>
              </Link>
            ))}
          </div>
          
          <div className="text-center mt-8">
            <Button size="lg" variant="secondary" asChild>
              <Link to="/chapas-de-acrilico">
                Ver Mais Chapas
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
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
                  <span className="text-sm">Atendimento B2B e B2C</span>
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

            {/* Right - Map */}
            <div>
              <h2 className="font-bold text-2xl md:text-3xl text-foreground mb-8">
                Nossa Localização
              </h2>
              <GoogleMapEmbed height="300px" />
              <div className="mt-4 text-muted-foreground text-sm">
                <p className="font-semibold text-foreground">{COMPANY.address}</p>
                <p>Telefone: {COMPANY.phone}</p>
                <p>WhatsApp: {COMPANY.whatsappFormatted}</p>
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
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Button size="lg" variant="secondary" asChild>
              <Link to="/home/orcamento">Solicitar Orçamento</Link>
            </Button>
            <Button 
              size="lg" 
              className="btn-whatsapp"
              asChild
            >
              <a 
                href={`https://wa.me/${COMPANY.whatsapp}?text=${encodeURIComponent(`Olá! Gostaria de mais informações sobre os produtos da ${COMPANY.name}.`)}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                Falar pelo WhatsApp
              </a>
            </Button>
          </div>
        </div>
      </section>
    </>
  );
}
