import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { COMPANY } from "@/lib/constants";
import { DecorativeDivider } from "@/components/ui/DecorativeDivider";
import { BlueBanner } from "@/components/ui/BlueBanner";
import { TestimonialCard } from "@/components/ui/TestimonialCard";
import { ClientLogos } from "@/components/ui/ClientLogos";
import { GoogleMapEmbed } from "@/components/ui/GoogleMapEmbed";
import { ProductCategoryGrid } from "@/components/home/ProductCategoryGrid";
import { EmbeddedQuoteForm } from "@/components/forms/EmbeddedQuoteForm";

// Categories with products
const categorias = [
  {
    titulo: "CAIXAS, POTES, CÚPULAS, REDOMAS",
    produtos: [
      { nome: "Caixas Sob Medida", href: "/acrilico-sob-medida/caixas-sob-medida" },
      { nome: "Cúpulas e Redomas", href: "/acrilico-sob-medida/cupulas-e-redomas" },
      { nome: "Potes para Doces", href: "/acrilico-sob-medida/potes-para-doces-e-guloseimas" },
      { nome: "Potes para Grãos", href: "/acrilico-sob-medida/potes-para-graos-e-cereais-a-granel" },
    ],
  },
  {
    titulo: "MEDALHAS E TROFÉUS PERSONALIZADOS",
    produtos: [
      { nome: "Medalhas Personalizadas", href: "/acrilico-sob-medida/medalhas-personalizadas" },
      { nome: "Troféus Personalizados", href: "/acrilico-sob-medida/trofeus-personalizados" },
    ],
  },
  {
    titulo: "PLACAS SOB MEDIDA, PERSONALIZADAS E GRAVADAS",
    produtos: [
      { nome: "Placa Customizada", href: "/acrilico-sob-medida/placa-de-acrilico-customizada" },
      { nome: "Placa Sinalização", href: "/acrilico-sob-medida/placa-de-acrilico-sinalizacao" },
    ],
  },
  {
    titulo: "DISPLAY, URNAS E QUADROS",
    produtos: [
      { nome: "Display de Acrílico", href: "/acrilico-sob-medida/display-de-acrilico" },
      { nome: "Urna de Acrílico", href: "/acrilico-sob-medida/urna-de-acrilico" },
      { nome: "Caixa de Sugestão", href: "/acrilico-sob-medida/caixa-de-sugestao" },
    ],
  },
  {
    titulo: "EXPOSITORES",
    produtos: [
      { nome: "Expositores para Bijuterias", href: "/acrilico-sob-medida/expositores-para-bijuterias" },
      { nome: "Expositores para Calçados", href: "/acrilico-sob-medida/expositores-para-calcados" },
      { nome: "Expositores para Óculos", href: "/acrilico-sob-medida/expositores-para-oculos" },
      { nome: "Porta Folder", href: "/acrilico-sob-medida/porta-folder" },
    ],
  },
];

// Depoimentos
const depoimentos = [
  { nome: "Carlos Silva", empresa: "Loja de Bijuterias", texto: "Excelente qualidade nos expositores. Minha loja ficou muito mais organizada e bonita!" },
  { nome: "Ana Paula", empresa: "Confeitaria Doce Sabor", texto: "Os potes de acrílico são perfeitos para expor os doces. Clientes elogiam muito!" },
  { nome: "Roberto Santos", empresa: "Arquiteto", texto: "Trabalho com a Lab Acrílicos há anos. Sempre entregam no prazo e com qualidade impecável." },
  { nome: "Maria Fernanda", empresa: "Joalheria Elegance", texto: "Os displays valorizaram muito nossas peças. Atendimento excepcional desde o primeiro contato!" },
];

export default function AcrilicoSobMedida() {
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
              <p className="text-primary-foreground/80">
                Produtos, Caixas e Placas de acrílico Transparente, Cristal e Coloridos.
              </p>
            </div>
            
            {/* Cube image placeholder */}
            <div className="flex justify-center">
              <div className="w-64 h-64 bg-primary-foreground/10 rounded-lg flex items-center justify-center">
                <span className="text-primary-foreground/50">Cubo 3D</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Seção Empresa */}
      <section className="section-padding bg-secondary">
        <div className="container-custom">
          <DecorativeDivider />
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
            {/* Image placeholder */}
            <div className="aspect-video bg-muted rounded-lg flex items-center justify-center">
              <span className="text-muted-foreground">Foto da Equipe Lab Acrílicos</span>
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
              />
            ))}
          </div>
        </div>
      </section>

      {/* Formulário de Orçamento */}
      <section className="section-padding bg-primary/95">
        <div className="container-custom">
          <div className="max-w-2xl mx-auto">
            <EmbeddedQuoteForm variant="dark" />
          </div>
        </div>
      </section>

      {/* Nossa Localização */}
      <section className="section-padding">
        <div className="container-custom">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
            <div>
              <h2 className="font-bold text-2xl md:text-3xl text-foreground mb-8">
                Nossa Localização
              </h2>
              <GoogleMapEmbed height="350px" />
            </div>
            
            <div className="flex flex-col justify-center">
              <h3 className="font-bold text-xl text-foreground mb-6">
                Dados de Contato
              </h3>
              <div className="space-y-4 text-muted-foreground">
                <p>
                  <span className="font-semibold text-foreground">Endereço:</span><br />
                  {COMPANY.address}
                </p>
                <p>
                  <span className="font-semibold text-foreground">Telefone:</span><br />
                  {COMPANY.phone}
                </p>
                <p>
                  <span className="font-semibold text-foreground">WhatsApp:</span><br />
                  {COMPANY.whatsappFormatted}
                </p>
                <p>
                  <span className="font-semibold text-foreground">E-mail:</span><br />
                  {COMPANY.email}
                </p>
                <p>
                  <span className="font-semibold text-foreground">Horário:</span><br />
                  {COMPANY.businessHours}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
