import { Link } from "react-router-dom";
import { SEOHead, createFAQSchema } from "@/components/SEOHead";
import { Button } from "@/components/ui/button";
import { MessageCircle } from "lucide-react";
import { COMPANY } from "@/lib/constants";
import { DecorativeDivider } from "@/components/ui/DecorativeDivider";
import { BlueBanner } from "@/components/ui/BlueBanner";
import { useWhatsAppModal } from "@/contexts/WhatsAppModalContext";
 import { useEmailQuoteModal } from "@/contexts/EmailQuoteModalContext";
import { Carousel, CarouselContent, CarouselItem } from "@/components/ui/carousel";
import Autoplay from "embla-carousel-autoplay";
import { useRef } from "react";
import { CHAPAS_PAGINA_IMAGES, CHAPAS_IMAGES } from "@/lib/images";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

// FAQ para Schema
const faqItems = [{
  question: "Qual o prazo de entrega das chapas de acrílico?",
  answer: "O prazo varia de 3 a 10 dias úteis, dependendo do tipo de chapa e quantidade. Consulte-nos para prazo exato."
}, {
  question: "Vocês fazem corte sob medida?",
  answer: "Sim! Realizamos cortes de chapas de acrílico, policarbonato, PETG, PS, PVC e ACM em qualquer medida."
}, {
  question: "Qual a espessura mínima e máxima disponível?",
  answer: "Trabalhamos com espessuras de 1mm até 50mm, dependendo do tipo de chapa."
}];

// Imagens do carrossel hero
import heroAcm from "@/assets/chapas-hero/acm.jpg";
import heroAcrilicoColorido from "@/assets/chapas-hero/acrilico-colorido.jpg";
import heroAcrilicoTransparente from "@/assets/chapas-hero/acrilico-transparente.jpg";
import heroPetg from "@/assets/chapas-hero/petg.jpg";
import heroPolicarbonatoAlveolar from "@/assets/chapas-hero/policarbonato-alveolar.jpg";
import heroPolicarbonatoCompacto from "@/assets/chapas-hero/policarbonato-compacto.jpg";
import heroPoliestireno from "@/assets/chapas-hero/poliestireno.jpg";
import heroPvcExpandido from "@/assets/chapas-hero/pvc-expandido.jpg";
const heroCarouselImages = [{
  src: heroAcrilicoTransparente,
  alt: "Chapas de Acrílico Transparente"
}, {
  src: heroAcrilicoColorido,
  alt: "Chapas de Acrílico Colorido"
}, {
  src: heroPetg,
  alt: "Chapas PETG"
}, {
  src: heroPolicarbonatoAlveolar,
  alt: "Chapas Policarbonato Alveolar"
}, {
  src: heroPolicarbonatoCompacto,
  alt: "Chapas Policarbonato Compacto"
}, {
  src: heroPoliestireno,
  alt: "Chapas Poliestireno"
}, {
  src: heroPvcExpandido,
  alt: "Chapas PVC Expandido"
}, {
  src: heroAcm,
  alt: "Chapas ACM"
}];

// Tipos de chapas com detalhes
const tiposChapas = [{
  id: "cast",
  slug: "acrilico",
  nome: "CHAPAS de Acrílico",
  desc: "O acrílico CAST é produzido pelo processo de vazamento (casting), resultando em chapas de alta qualidade com excelente transparência e resistência. Ideal para projetos que exigem perfeição óptica e durabilidade superior.",
  imageUrl: CHAPAS_PAGINA_IMAGES.cast,
  aplicacoes: ["Vitrines e displays de alto padrão", "Projetos arquitetônicos", "Comunicação visual premium", "Aquários e piscinas", "Móveis e decoração"],
  caracteristicas: ["Transparência cristalina (92% de transmissão de luz)", "Alta resistência a intempéries", "Fácil usinagem e polimento", "Resistente a UV", "Disponível em diversas cores e espessuras"],
  imagePosition: "left"
}, {
  id: "ps",
  slug: "poliestireno",
  nome: "CHAPAS Poliestireno (PS e PSAI)",
  desc: "O Poliestireno é uma alternativa econômica ao acrílico, oferecendo boa transparência e facilidade de trabalho. Disponível nas versões PS (cristal) e PSAI (alto impacto).",
  imageUrl: CHAPAS_PAGINA_IMAGES.poliestireno,
  aplicacoes: ["Molduras e porta-retratos", "Displays descartáveis", "Embalagens", "Luminárias simples", "Projetos de curta duração"],
  caracteristicas: ["Custo-benefício excelente", "Fácil corte e dobra", "Leve e versátil", "Ideal para projetos de baixo custo", "Disponível em cristal e leitoso"],
  imagePosition: "right"
}, {
  id: "petg",
  slug: "petg",
  nome: "CHAPAS PETG",
  desc: "O PETG combina transparência semelhante ao acrílico com alta resistência ao impacto. É ideal para aplicações que exigem segurança e durabilidade.",
  imageUrl: CHAPAS_PAGINA_IMAGES.petg,
  aplicacoes: ["Proteções de máquinas", "Viseiras e EPIs", "Displays para alimentos", "Mobiliário urbano", "Painéis de segurança"],
  caracteristicas: ["Alta resistência ao impacto", "Atóxico e aprovado para contato com alimentos", "Boa transparência", "Resistente a produtos químicos", "Fácil termoformagem"],
  imagePosition: "left"
}, {
  id: "pc-alveolar",
  slug: "policarbonato-alveolar",
  nome: "CHAPAS Policarbonato Alveolar",
  desc: "O Policarbonato Alveolar é uma chapa multicamadas com câmaras de ar, oferecendo excelente isolamento térmico e leveza. Ideal para coberturas e fechamentos.",
  imageUrl: CHAPAS_PAGINA_IMAGES.policarbonatoAlveolar,
  aplicacoes: ["Coberturas e pergolados", "Telhados translúcidos", "Estufas agrícolas", "Fechamentos laterais", "Divisórias internas"],
  caracteristicas: ["Leveza excepcional", "Isolamento térmico e acústico", "Proteção UV", "Fácil instalação", "Alta resistência a impactos"],
  imagePosition: "right"
}, {
  id: "pc-compacto",
  slug: "policarbonato-compacto",
  nome: "CHAPAS Policarbonato Compacto",
  desc: "O Policarbonato Compacto é uma das chapas mais resistentes do mercado, com resistência ao impacto 250 vezes maior que o vidro comum.",
  imageUrl: CHAPAS_PAGINA_IMAGES.policarbonatoCompacto,
  aplicacoes: ["Blindagem arquitetônica", "Escudos de proteção", "Vitrines de segurança", "Proteções industriais", "Coberturas de alto impacto"],
  caracteristicas: ["Extrema resistência ao impacto", "Transparência similar ao vidro", "Resistente a vandalismo", "Proteção UV integrada", "Leve comparado ao vidro"],
  imagePosition: "left"
}, {
  id: "pvc",
  slug: "pvc-expandido",
  nome: "CHAPAS de PVC Expandido",
  desc: "O PVC Expandido é uma chapa leve e versátil, ideal para comunicação visual e aplicações internas. Fácil de cortar, colar e pintar.",
  imageUrl: CHAPAS_PAGINA_IMAGES.pvc,
  aplicacoes: ["Painéis de comunicação visual", "Displays e totens", "Revestimentos internos", "Projetos de cenografia", "Maquetes e protótipos"],
  caracteristicas: ["Extremamente leve", "Fácil de trabalhar", "Boa impressão direta", "Resistente à umidade", "Não propaga chamas"],
  imagePosition: "right"
}, {
  id: "acm",
  slug: "acm",
  nome: "CHAPAS ACM",
  desc: "O ACM (Alumínio Composto) é formado por duas lâminas de alumínio com núcleo de polietileno. Ideal para fachadas, letreiros e revestimentos externos.",
  imageUrl: CHAPAS_PAGINA_IMAGES.acm,
  aplicacoes: ["Fachadas de lojas e edifícios", "Letreiros e totens", "Revestimentos externos", "Painéis de sinalização", "Mobiliário urbano"],
  caracteristicas: ["Alta durabilidade", "Resistente a intempéries", "Diversas cores disponíveis", "Fácil manutenção", "Excelente acabamento"],
  imagePosition: "left"
}];
export default function ChapasDeAcrilico() {
  const {
    openWhatsAppModal
  } = useWhatsAppModal();
   const { openEmailModal } = useEmailQuoteModal();
  const autoplayPlugin = useRef(Autoplay({
    delay: 1000,
    stopOnInteraction: false
  }));
  return <>
      <SEOHead title="Chapas no RJ - Acrílico, Policarbonato, PS, PETG, ACM" description="Distribuidora de chapas plásticas: Acrílico, Policarbonato alveolar e compacto, PETG, Poliestireno, PVC Expandido e ACM. Corte sob medida. Melhor preço do Rio de Janeiro." canonical="/chapas" schema={createFAQSchema(faqItems)} />
 
      {/* Hero - 2 Colunas */}
      <section className="bg-muted py-16 md:py-20">
        <div className="container-custom">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
            {/* Left - Text */}
            <div>
              <h1 className="font-bold text-3xl md:text-4xl lg:text-5xl text-foreground mb-6">
                CHAPAS DE ACRÍLICO, POLICARBONATOS E OUTROS PLÁSTICOS
              </h1>
              <p className="text-lg text-accent font-medium mb-4">
                Distribuidora de chapas plásticas com o melhor preço do Rio de Janeiro
              </p>
              <p className="text-muted-foreground mb-8">Trabalhamos com Acrílico (cristal, colorido, leitoso, espelhado), Policarbonato (alveolar e compacto), PETG, Poliestireno (PS), PVC Expandido e ACM. </p>
              <div className="flex flex-col items-start gap-3">
                <Button size="lg" className="btn-whatsapp text-lg px-8 py-6" onClick={() => openWhatsAppModal("Chapa Inteira ou Cortada")}>
                  <MessageCircle className="h-5 w-5 mr-2" />
                  Orçamento via WhatsApp
                </Button>
                 <button onClick={() => openEmailModal("Chapas de Acrílico")} className="text-muted-foreground hover:text-foreground text-sm underline underline-offset-4">
                  Prefere orçamento via e-mail?
                 </button>
              </div>
            </div>

            {/* Right - Carousel */}
            <div className="aspect-video bg-muted rounded-lg overflow-hidden">
              <Carousel plugins={[autoplayPlugin.current]} opts={{
              loop: true
            }} className="w-full h-full">
                <CarouselContent className="h-full -ml-0">
                  {heroCarouselImages.map((image, index) => <CarouselItem key={index} className="h-full pl-0">
                      <img src={image.src} alt={image.alt} className="w-full h-full object-cover" loading={index === 0 ? "eager" : "lazy"} />
                    </CarouselItem>)}
                </CarouselContent>
              </Carousel>
            </div>
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
          {tiposChapas.map(chapa => <div key={chapa.id} className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-start">
              {/* Image */}
              <div className={`${chapa.imagePosition === "right" ? "lg:order-2" : "lg:order-1"}`}>
                <Link to={`/chapas/${chapa.slug}`} className="block">
                  <div className="aspect-video bg-muted rounded-lg overflow-hidden hover:opacity-90 transition-opacity cursor-pointer">
                    <img src={chapa.imageUrl} alt={chapa.nome} className="w-full h-full object-cover" loading="lazy" />
                  </div>
                </Link>
              </div>

              {/* Content */}
              <div className={`${chapa.imagePosition === "right" ? "lg:order-1" : "lg:order-2"}`}>
                <Link to={`/chapas/${chapa.slug}`}>
                  <h3 className="font-bold text-xl md:text-2xl text-primary mb-4 hover:underline cursor-pointer">
                    {chapa.nome}
                  </h3>
                </Link>
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
                        {chapa.aplicacoes.map((app, i) => <li key={i} className="flex items-center gap-2 text-muted-foreground">
                            <div className="w-1.5 h-1.5 rounded-full bg-accent" />
                            {app}
                          </li>)}
                      </ul>
                    </AccordionContent>
                  </AccordionItem>

                  <AccordionItem value="caracteristicas">
                    <AccordionTrigger className="text-foreground font-semibold">
                      Características
                    </AccordionTrigger>
                    <AccordionContent>
                      <ul className="space-y-2">
                        {chapa.caracteristicas.map((car, i) => <li key={i} className="flex items-center gap-2 text-muted-foreground">
                            <div className="w-1.5 h-1.5 rounded-full bg-accent" />
                            {car}
                          </li>)}
                      </ul>
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
              </div>
            </div>)}
        </div>
      </section>

      {/* CTA Final */}
      <section className="section-padding bg-muted">
        <div className="container-custom text-center">
          <h2 className="font-bold text-2xl md:text-3xl text-foreground mb-4">
            Solicite seu Orçamento
          </h2>
          <p className="text-muted-foreground mb-8 max-w-xl mx-auto">
            Informe o tipo de chapa, espessura e dimensões desejadas para receber um orçamento personalizado.
          </p>
          <div className="flex flex-col items-center gap-4">
            <Button size="lg" className="btn-whatsapp text-lg px-8 py-6" onClick={() => openWhatsAppModal("Chapa Inteira ou Cortada")}>
              <MessageCircle className="h-5 w-5 mr-2" />
              Orçamento via WhatsApp
            </Button>
             <button onClick={() => openEmailModal("Chapas de Acrílico")} className="text-muted-foreground hover:text-foreground text-sm underline underline-offset-4">
              Prefere orçamento via e-mail?
             </button>
          </div>
        </div>
      </section>
    </>;
}