import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight, Plus, Minus } from "lucide-react";
import { COMPANY } from "@/lib/constants";
import { DecorativeDivider } from "@/components/ui/DecorativeDivider";
import { BlueBanner } from "@/components/ui/BlueBanner";
import { HeroSlider } from "@/components/home/HeroSlider";
import { CHAPAS_PAGINA_IMAGES } from "@/lib/images";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

// Tipos de chapas com detalhes
const tiposChapas = [
  {
    id: "cast",
    nome: "CHAPAS Acrílico CAST (100% Virgem)",
    desc: "O acrílico CAST é produzido pelo processo de vazamento (casting), resultando em chapas de alta qualidade com excelente transparência e resistência. Ideal para projetos que exigem perfeição óptica e durabilidade superior.",
    imageUrl: CHAPAS_PAGINA_IMAGES.cast,
    aplicacoes: [
      "Vitrines e displays de alto padrão",
      "Projetos arquitetônicos",
      "Comunicação visual premium",
      "Aquários e piscinas",
      "Móveis e decoração",
    ],
    caracteristicas: [
      "Transparência cristalina (92% de transmissão de luz)",
      "Alta resistência a intempéries",
      "Fácil usinagem e polimento",
      "Resistente a UV",
      "Disponível em diversas cores e espessuras",
    ],
    imagePosition: "left",
  },
  {
    id: "ps",
    nome: "CHAPAS Poliestireno (PS e PSAI)",
    desc: "O Poliestireno é uma alternativa econômica ao acrílico, oferecendo boa transparência e facilidade de trabalho. Disponível nas versões PS (cristal) e PSAI (alto impacto).",
    imageUrl: CHAPAS_PAGINA_IMAGES.poliestireno,
    aplicacoes: [
      "Molduras e porta-retratos",
      "Displays descartáveis",
      "Embalagens",
      "Luminárias simples",
      "Projetos de curta duração",
    ],
    caracteristicas: [
      "Custo-benefício excelente",
      "Fácil corte e dobra",
      "Leve e versátil",
      "Ideal para projetos de baixo custo",
      "Disponível em cristal e leitoso",
    ],
    imagePosition: "right",
  },
  {
    id: "petg",
    nome: "CHAPAS PETG",
    desc: "O PETG combina transparência semelhante ao acrílico com alta resistência ao impacto. É ideal para aplicações que exigem segurança e durabilidade.",
    imageUrl: CHAPAS_PAGINA_IMAGES.petg,
    aplicacoes: [
      "Proteções de máquinas",
      "Viseiras e EPIs",
      "Displays para alimentos",
      "Mobiliário urbano",
      "Painéis de segurança",
    ],
    caracteristicas: [
      "Alta resistência ao impacto",
      "Atóxico e aprovado para contato com alimentos",
      "Boa transparência",
      "Resistente a produtos químicos",
      "Fácil termoformagem",
    ],
    imagePosition: "left",
  },
  {
    id: "pc-alveolar",
    nome: "CHAPAS Policarbonato Alveolar",
    desc: "O Policarbonato Alveolar é uma chapa multicamadas com câmaras de ar, oferecendo excelente isolamento térmico e leveza. Ideal para coberturas e fechamentos.",
    imageUrl: CHAPAS_PAGINA_IMAGES.policarbonatoAlveolar,
    aplicacoes: [
      "Coberturas e pergolados",
      "Telhados translúcidos",
      "Estufas agrícolas",
      "Fechamentos laterais",
      "Divisórias internas",
    ],
    caracteristicas: [
      "Leveza excepcional",
      "Isolamento térmico e acústico",
      "Proteção UV",
      "Fácil instalação",
      "Alta resistência a impactos",
    ],
    imagePosition: "right",
  },
  {
    id: "pc-compacto",
    nome: "CHAPAS Policarbonato Compacto",
    desc: "O Policarbonato Compacto é uma das chapas mais resistentes do mercado, com resistência ao impacto 250 vezes maior que o vidro comum.",
    imageUrl: CHAPAS_PAGINA_IMAGES.policarbonatoCompacto,
    aplicacoes: [
      "Blindagem arquitetônica",
      "Escudos de proteção",
      "Vitrines de segurança",
      "Proteções industriais",
      "Coberturas de alto impacto",
    ],
    caracteristicas: [
      "Extrema resistência ao impacto",
      "Transparência similar ao vidro",
      "Resistente a vandalismo",
      "Proteção UV integrada",
      "Leve comparado ao vidro",
    ],
    imagePosition: "left",
  },
  {
    id: "pvc",
    nome: "CHAPAS de PVC Expandido",
    desc: "O PVC Expandido é uma chapa leve e versátil, ideal para comunicação visual e aplicações internas. Fácil de cortar, colar e pintar.",
    imageUrl: CHAPAS_PAGINA_IMAGES.pvc,
    aplicacoes: [
      "Painéis de comunicação visual",
      "Displays e totens",
      "Revestimentos internos",
      "Projetos de cenografia",
      "Maquetes e protótipos",
    ],
    caracteristicas: [
      "Extremamente leve",
      "Fácil de trabalhar",
      "Boa impressão direta",
      "Resistente à umidade",
      "Não propaga chamas",
    ],
    imagePosition: "right",
  },
  {
    id: "acm",
    nome: "CHAPAS ACM",
    desc: "O ACM (Alumínio Composto) é formado por duas lâminas de alumínio com núcleo de polietileno. Ideal para fachadas, letreiros e revestimentos externos.",
    imageUrl: CHAPAS_PAGINA_IMAGES.acm,
    aplicacoes: [
      "Fachadas de lojas e edifícios",
      "Letreiros e totens",
      "Revestimentos externos",
      "Painéis de sinalização",
      "Mobiliário urbano",
    ],
    caracteristicas: [
      "Alta durabilidade",
      "Resistente a intempéries",
      "Diversas cores disponíveis",
      "Fácil manutenção",
      "Excelente acabamento",
    ],
    imagePosition: "left",
  },
];

// Cores disponíveis
const coresDisponiveis = [
  { nome: "Cristal", cor: "transparent" },
  { nome: "Branco", cor: "#FFFFFF" },
  { nome: "Preto", cor: "#000000" },
  { nome: "Vermelho", cor: "#E53935" },
  { nome: "Azul", cor: "#1E88E5" },
  { nome: "Verde", cor: "#43A047" },
  { nome: "Amarelo", cor: "#FDD835" },
  { nome: "Laranja", cor: "#FB8C00" },
  { nome: "Fumê", cor: "#424242" },
  { nome: "Espelhado", cor: "linear-gradient(135deg, #C0C0C0, #FFFFFF, #C0C0C0)" },
  { nome: "Leitoso", cor: "#F5F5F5" },
  { nome: "Fluorescente", cor: "linear-gradient(135deg, #FF1493, #00FF00)" },
];

export default function ChapasDeAcrilico() {
  return (
    <>
      {/* Hero - 2 Colunas */}
      <section className="bg-muted py-16 md:py-20">
        <div className="container-custom">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
            {/* Left - Text */}
            <div>
              <h1 className="font-bold text-3xl md:text-4xl lg:text-5xl text-foreground mb-6">
                CHAPAS DE ACRÍLICO
              </h1>
              <p className="text-lg text-accent font-medium mb-4">
                A melhor fábrica de acrílico com o melhor preço do Rio de Janeiro
              </p>
              <p className="text-muted-foreground mb-8">
                Trabalhamos com chapas de acrílico cristal, colorido, leitoso, espelhado, fumê e muito mais. 
                Atendemos projetos de todos os portes com qualidade e preço justo.
              </p>
              <Button size="lg" asChild>
                <Link to="/home/orcamento">
                  Solicitar Orçamento
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
            </div>

            {/* Right - Slider */}
            <HeroSlider />
          </div>
        </div>
      </section>

      {/* Introdução + Cores */}
      <section className="section-padding">
        <div className="container-custom">
          <DecorativeDivider />
          
          <div className="text-center mb-12">
            <h2 className="font-bold text-2xl md:text-3xl text-foreground mb-4">
              Chapas de acrílico cristal e diversas cores
            </h2>
            <p className="text-muted-foreground max-w-3xl mx-auto">
              Trabalhamos com uma ampla variedade de cores e acabamentos para atender qualquer projeto. 
              Todas as chapas passam por rigoroso controle de qualidade.
            </p>
          </div>

          {/* Grid de cores */}
          <div className="grid grid-cols-4 md:grid-cols-6 lg:grid-cols-12 gap-3 mb-12">
            {coresDisponiveis.map((cor, index) => (
              <div key={index} className="text-center">
                <div 
                  className="w-full aspect-square rounded-lg border-2 border-border shadow-sm mb-2"
                  style={{ 
                    background: cor.cor === "transparent" 
                      ? "repeating-conic-gradient(#ccc 0% 25%, transparent 0% 50%) 50% / 10px 10px"
                      : cor.cor
                  }}
                />
                <span className="text-xs text-muted-foreground">{cor.nome}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Banner Azul */}
      <BlueBanner>
        Chapas de Acrílico cristal e diversas cores, Poliestireno (PS e PSAI), PETG, Policarbonato, ACM e PVC.
      </BlueBanner>

      {/* Lista de Tipos de Chapas - Layout Alternado */}
      <section className="section-padding">
        <div className="container-custom space-y-16">
          {tiposChapas.map((chapa, index) => (
            <div 
              key={chapa.id}
              className={`grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-start ${
                chapa.imagePosition === "right" ? "" : "lg:flex-row-reverse"
              }`}
            >
              {/* Image */}
              <div className={`${chapa.imagePosition === "right" ? "lg:order-2" : "lg:order-1"}`}>
                <div className="aspect-video bg-muted rounded-lg overflow-hidden">
                  <img 
                    src={chapa.imageUrl} 
                    alt={chapa.nome}
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />
                </div>
              </div>

              {/* Content */}
              <div className={`${chapa.imagePosition === "right" ? "lg:order-1" : "lg:order-2"}`}>
                <h3 className="font-bold text-xl md:text-2xl text-primary mb-4">
                  {chapa.nome}
                </h3>
                <p className="text-muted-foreground mb-6">
                  {chapa.desc}
                </p>

                {/* Accordions */}
                <Accordion type="single" collapsible className="w-full">
                  <AccordionItem value="aplicacoes">
                    <AccordionTrigger className="text-foreground font-semibold">
                      Principais Aplicações
                    </AccordionTrigger>
                    <AccordionContent>
                      <ul className="space-y-2">
                        {chapa.aplicacoes.map((app, i) => (
                          <li key={i} className="flex items-center gap-2 text-muted-foreground">
                            <div className="w-1.5 h-1.5 rounded-full bg-accent" />
                            {app}
                          </li>
                        ))}
                      </ul>
                    </AccordionContent>
                  </AccordionItem>

                  <AccordionItem value="caracteristicas">
                    <AccordionTrigger className="text-foreground font-semibold">
                      Características
                    </AccordionTrigger>
                    <AccordionContent>
                      <ul className="space-y-2">
                        {chapa.caracteristicas.map((car, i) => (
                          <li key={i} className="flex items-center gap-2 text-muted-foreground">
                            <div className="w-1.5 h-1.5 rounded-full bg-accent" />
                            {car}
                          </li>
                        ))}
                      </ul>
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Espessuras Disponíveis */}
      <section className="section-padding bg-secondary">
        <div className="container-custom">
          <div className="max-w-3xl mx-auto">
            <h2 className="font-bold text-2xl md:text-3xl text-foreground mb-8 text-center">
              Espessuras Disponíveis
            </h2>
            <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4 mb-8">
              {["2mm", "3mm", "4mm", "5mm", "6mm", "8mm", "10mm", "15mm", "20mm", "25mm", "30mm", "Sob consulta"].map((esp) => (
                <div 
                  key={esp} 
                  className="bg-card p-4 rounded-lg text-center font-semibold text-foreground shadow-sm"
                >
                  {esp}
                </div>
              ))}
            </div>
            <p className="text-muted-foreground text-center">
              Trabalhamos com chapas de diversas espessuras. Consulte disponibilidade e tamanhos.
            </p>
          </div>
        </div>
      </section>

      {/* CTA Final */}
      <section className="section-padding bg-primary text-primary-foreground">
        <div className="container-custom text-center">
          <h2 className="font-bold text-2xl md:text-3xl mb-4">
            Solicite seu Orçamento
          </h2>
          <p className="text-primary-foreground/80 mb-8 max-w-xl mx-auto">
            Informe o tipo de chapa, espessura e dimensões desejadas para receber um orçamento personalizado.
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
                href={`https://wa.me/${COMPANY.whatsapp}?text=${encodeURIComponent(`Olá! Gostaria de um orçamento para chapas de acrílico.`)}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                Orçamento via WhatsApp
              </a>
            </Button>
          </div>
        </div>
      </section>
    </>
  );
}
