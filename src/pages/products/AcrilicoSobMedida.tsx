import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { MessageCircle } from "lucide-react";
import { COMPANY } from "@/lib/constants";
import { DecorativeDivider } from "@/components/ui/DecorativeDivider";
import { TestimonialCard } from "@/components/ui/TestimonialCard";
import { ClientLogos } from "@/components/ui/ClientLogos";
import { GoogleMapEmbed } from "@/components/ui/GoogleMapEmbed";
import { ProductCategoryGrid } from "@/components/home/ProductCategoryGrid";
import { EmbeddedQuoteForm } from "@/components/forms/EmbeddedQuoteForm";
import { useWhatsAppModal } from "@/contexts/WhatsAppModalContext";
import { SOBMEDIDA_IMAGES, DEPOIMENTOS_IMAGES, HERO_IMAGES } from "@/lib/images";

// Categories with products (links apontam para a própria página)
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
    ],
  },
  {
    titulo: "DISPLAY, URNAS E QUADROS",
    produtos: [
      { nome: "Display de Acrílico", href: "/acrilico-sob-medida", imageUrl: SOBMEDIDA_IMAGES.display },
      { nome: "Urna de Acrílico", href: "/acrilico-sob-medida", imageUrl: SOBMEDIDA_IMAGES.urna },
      { nome: "Caixa de Sugestão", href: "/acrilico-sob-medida", imageUrl: SOBMEDIDA_IMAGES.caixaSugestao },
    ],
  },
  {
    titulo: "EXPOSITORES",
    produtos: [
      { nome: "Expositores para Bijuterias", href: "/acrilico-sob-medida", imageUrl: SOBMEDIDA_IMAGES.expositoresBijuterias },
      { nome: "Expositores para Calçados", href: "/acrilico-sob-medida", imageUrl: SOBMEDIDA_IMAGES.expositoresCalcados },
      { nome: "Porta Folder", href: "/acrilico-sob-medida", imageUrl: SOBMEDIDA_IMAGES.portaFolder },
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

  return (
    <>
      {/* Hero Azul */}
      <section className="bg-primary text-primary-foreground py-16 md:py-24">
        <div className="container-custom">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
            <div>
              <h1 className="font-bold text-3xl md:text-4xl lg:text-5xl mb-6">
                A MELHOR FÁBRICA DE ACRÍLICO PERSONALIZADO E SOB MEDIDA
              </h1>
              <p className="text-lg text-primary-foreground/90 mb-4">
                do Rio de Janeiro (RJ).
              </p>
              <p className="text-primary-foreground/80 mb-8">
                Produtos, Caixas e Placas de acrílico Transparente, Cristal e Coloridos.
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
                  className="text-primary-foreground/70 hover:text-primary-foreground text-sm underline underline-offset-4"
                >
                  Prefere orçamento via e-mail?
                </Link>
              </div>
            </div>
            
            {/* Hero Image */}
            <div className="flex justify-center">
              <img 
                src={HERO_IMAGES.cubo3d} 
                alt="Cubo 3D de Acrílico" 
                className="w-64 h-64 object-contain"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Seção Empresa */}
      <section className="section-padding bg-secondary">
        <div className="container-custom">
          <DecorativeDivider />
          
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="font-bold text-2xl md:text-3xl text-foreground mb-6">
              Conheça um pouco da nossa empresa
            </h2>
            <p className="text-muted-foreground">
              A {COMPANY.name} é uma empresa familiar que nasceu da paixão pelo trabalho com acrílico. 
              Ao longo de mais de três décadas, construímos uma reputação sólida baseada na qualidade, 
              no atendimento personalizado e na capacidade de transformar ideias em realidade.
            </p>
          </div>
        </div>
      </section>

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
    </>
  );
}
