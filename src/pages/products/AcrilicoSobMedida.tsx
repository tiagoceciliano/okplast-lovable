import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { MessageCircle } from "lucide-react";
import { COMPANY } from "@/lib/constants";
import { DecorativeDivider } from "@/components/ui/DecorativeDivider";
import { BlueBanner } from "@/components/ui/BlueBanner";
import { TestimonialCard } from "@/components/ui/TestimonialCard";
import { ClientLogos } from "@/components/ui/ClientLogos";
import { ProductCategoryGrid } from "@/components/home/ProductCategoryGrid";
import { useWhatsAppModal } from "@/contexts/WhatsAppModalContext";
import { SOBMEDIDA_IMAGES, DEPOIMENTOS_IMAGES } from "@/lib/images";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";
import Autoplay from "embla-carousel-autoplay";
import { useRef } from "react";

// Imagens do carrossel hero - reutilizando algumas imagens dos produtos
const heroCarouselImages = [
  { src: SOBMEDIDA_IMAGES.cupulas, alt: "Cúpulas e Redomas de Acrílico" },
  { src: SOBMEDIDA_IMAGES.trofeus, alt: "Troféus Personalizados" },
  { src: SOBMEDIDA_IMAGES.medalhas, alt: "Medalhas Personalizadas" },
  { src: SOBMEDIDA_IMAGES.display, alt: "Displays de Acrílico" },
  { src: SOBMEDIDA_IMAGES.caixas, alt: "Caixas Sob Medida" },
  { src: SOBMEDIDA_IMAGES.urna, alt: "Urnas de Acrílico" },
];

// Categories with products
const categorias = [
  {
    titulo: "CAIXAS, POTES, CÚPULAS, REDOMAS",
    produtos: [
      { nome: "Caixas Sob Medida", href: "/acrilico-sob-medida", imageUrl: SOBMEDIDA_IMAGES.caixas },
      { nome: "Cúpulas e Redomas", href: "/acrilico-sob-medida", imageUrl: SOBMEDIDA_IMAGES.cupulas },
      { nome: "Potes para Doces", href: "/acrilico-sob-medida", imageUrl: SOBMEDIDA_IMAGES.potesDoces },
      { nome: "Potes para Grãos", href: "/acrilico-sob-medida", imageUrl: SOBMEDIDA_IMAGES.potesGraos },
    ],
  },
  {
    titulo: "MEDALHAS E TROFÉUS PERSONALIZADOS",
    produtos: [
      { nome: "Medalhas Personalizadas", href: "/acrilico-sob-medida", imageUrl: SOBMEDIDA_IMAGES.medalhas },
      { nome: "Troféus Personalizados", href: "/acrilico-sob-medida", imageUrl: SOBMEDIDA_IMAGES.trofeus },
      { nome: "Medalha Personalizada", href: "/acrilico-sob-medida", imageUrl: SOBMEDIDA_IMAGES.medalhaPersonalizada },
      { nome: "Troféus Sob Medida", href: "/acrilico-sob-medida", imageUrl: SOBMEDIDA_IMAGES.trofeuSobMedida },
    ],
  },
  {
    titulo: "DISPLAY, URNAS E QUADROS",
    produtos: [
      { nome: "Display de Parede e Mesa", href: "/acrilico-sob-medida", imageUrl: SOBMEDIDA_IMAGES.display },
      { nome: "Urnas Transparente ou Coloridas", href: "/acrilico-sob-medida", imageUrl: SOBMEDIDA_IMAGES.urna },
      { nome: "Caixas Sob Medida", href: "/acrilico-sob-medida", imageUrl: SOBMEDIDA_IMAGES.caixaSugestao },
      { nome: "Quadro de Avisos", href: "/acrilico-sob-medida", imageUrl: SOBMEDIDA_IMAGES.quadroAvisos },
    ],
  },
  {
    titulo: "EXPOSITORES E CONFEITARIA",
    produtos: [
      { nome: "Expositores para Bijuterias", href: "/acrilico-sob-medida", imageUrl: SOBMEDIDA_IMAGES.expositoresBijuterias },
      { nome: "Expositores para Calçados", href: "/acrilico-sob-medida", imageUrl: SOBMEDIDA_IMAGES.expositoresCalcados },
      { nome: "Expositor de Óculos Ótica", href: "/acrilico-sob-medida", imageUrl: SOBMEDIDA_IMAGES.portaFolder },
      { nome: "Bolo Fake", href: "/acrilico-sob-medida", imageUrl: SOBMEDIDA_IMAGES.boloFake },
    ],
  },
];

// Depoimentos
const depoimentos = [
  { nome: "Carlos Silva", empresa: "Loja de Bijuterias", texto: "Excelente qualidade nos expositores. Minha loja ficou muito mais organizada e bonita!", avatarUrl: DEPOIMENTOS_IMAGES.avatar1 },
  { nome: "Ana Paula", empresa: "Confeitaria Doce Sabor", texto: "Os potes de acrílico são perfeitos para expor os doces. Clientes elogiam muito!", avatarUrl: DEPOIMENTOS_IMAGES.avatar2 },
  { nome: "Roberto Santos", empresa: "Arquiteto", texto: "Trabalho com a Lab Acrílicos há anos. Sempre entregam no prazo e com qualidade impecável.", avatarUrl: DEPOIMENTOS_IMAGES.avatar3 },
  { nome: "Maria Fernanda", empresa: "Joalheria Elegance", texto: "Os displays valorizaram muito nossas peças. Atendimento excepcional desde o primeiro contato!", avatarUrl: DEPOIMENTOS_IMAGES.avatar4 },
];

export default function AcrilicoSobMedida() {
  const { openWhatsAppModal } = useWhatsAppModal();
  const autoplayPlugin = useRef(
    Autoplay({ delay: 1000, stopOnInteraction: false })
  );

  return (
    <>
      {/* Hero - 2 Colunas (igual à página de Chapas) */}
      <section className="bg-muted py-16 md:py-20">
        <div className="container-custom">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
            {/* Left - Text */}
            <div>
              <h1 className="font-bold text-3xl md:text-4xl lg:text-5xl text-foreground mb-6">
                ACRÍLICO PERSONALIZADO E SOB MEDIDA
              </h1>
              <p className="text-lg text-accent font-medium mb-4">
                A melhor fábrica de acrílico do Rio de Janeiro (RJ)
              </p>
              <p className="text-muted-foreground mb-8">
                Produtos, Caixas e Placas de acrílico Transparente, Cristal e Coloridos. 
                Fabricamos sob medida para seu projeto.
              </p>
              <div className="flex flex-col items-start gap-3">
                <Button 
                  size="lg" 
                  className="btn-whatsapp text-lg px-8 py-6"
                  onClick={() => openWhatsAppModal("Produto Personalizado")}
                >
                  <MessageCircle className="h-5 w-5 mr-2" />
                  Orçamento via WhatsApp
                </Button>
                <Link 
                  to="/home/orcamento" 
                  className="text-muted-foreground hover:text-foreground text-sm underline underline-offset-4"
                >
                  Prefere orçamento via e-mail?
                </Link>
              </div>
            </div>

            {/* Right - Carousel */}
            <div className="aspect-video bg-muted rounded-lg overflow-hidden">
              <Carousel
                plugins={[autoplayPlugin.current]}
                opts={{ loop: true }}
                className="w-full h-full"
              >
                <CarouselContent className="h-full -ml-0">
                  {heroCarouselImages.map((image, index) => (
                    <CarouselItem key={index} className="h-full pl-0">
                      <img 
                        src={image.src} 
                        alt={image.alt}
                        className="w-full h-full object-cover"
                        loading={index === 0 ? "eager" : "lazy"}
                      />
                    </CarouselItem>
                  ))}
                </CarouselContent>
              </Carousel>
            </div>
          </div>
        </div>
      </section>

      {/* Seção Empresa */}
      <section className="section-padding">
        <div className="container-custom">
          <DecorativeDivider />
          
          <div className="text-center mb-12">
            <h2 className="font-bold text-2xl md:text-3xl text-foreground mb-4">
              Conheça um pouco da nossa empresa
            </h2>
            <p className="text-muted-foreground max-w-3xl mx-auto">
              A {COMPANY.name} é uma empresa familiar que nasceu da paixão pelo trabalho com acrílico. 
              Ao longo de mais de três décadas, construímos uma reputação sólida baseada na qualidade, 
              no atendimento personalizado e na capacidade de transformar ideias em realidade.
            </p>
          </div>
        </div>
      </section>

      {/* Banner Azul */}
      <BlueBanner>
        Produtos personalizados em acrílico: Caixas, Displays, Urnas, Troféus, Medalhas e muito mais.
      </BlueBanner>

      {/* Categorias de Produtos */}
      <section className="section-padding">
        <div className="container-custom space-y-16">
          {categorias.map((categoria, index) => (
            <ProductCategoryGrid
              key={index}
              title={categoria.titulo}
              products={categoria.produtos}
              columns={categoria.produtos.length === 2 ? 2 : categoria.produtos.length === 3 ? 3 : 4}
            />
          ))}
        </div>
      </section>

      {/* Grande Empresa, Grandes Clientes */}
      <section className="section-padding bg-secondary">
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

      {/* Satisfação Garantida */}
      <section className="section-padding">
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

      {/* CTA Final (igual à página de Chapas) */}
      <section className="section-padding bg-muted">
        <div className="container-custom text-center">
          <h2 className="font-bold text-2xl md:text-3xl text-foreground mb-4">
            Solicite seu Orçamento
          </h2>
          <p className="text-muted-foreground mb-8 max-w-xl mx-auto">
            Informe o produto desejado e suas medidas para receber um orçamento personalizado.
          </p>
          <div className="flex flex-col items-center gap-4">
            <Button 
              size="lg" 
              className="btn-whatsapp text-lg px-8 py-6"
              onClick={() => openWhatsAppModal("Produto Personalizado")}
            >
              <MessageCircle className="h-5 w-5 mr-2" />
              Orçamento via WhatsApp
            </Button>
            <Link 
              to="/home/orcamento" 
              className="text-muted-foreground hover:text-foreground text-sm underline underline-offset-4"
            >
              Prefere orçamento via e-mail?
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
