import { Link } from "@/lib/router-compat";
import { SEOHead, createBreadcrumbSchema, createProductSchema } from "@/components/SEOHead";
import { Button } from "@/components/ui/button";
import { MessageCircle, ArrowRight } from "lucide-react";
import { DecorativeDivider } from "@/components/ui/DecorativeDivider";
import { useWhatsAppModal } from "@/contexts/WhatsAppModalContext";

import heroPolicarbonatoAlveolar from "@/assets/chapas-hero/policarbonato-alveolar.webp";
import heroPolicarbonatoCompacto from "@/assets/chapas-hero/policarbonato-compacto.webp";

const espessurasAlveolar = ["4mm", "6mm", "10mm", "16mm", "20mm", "25mm"];
const espessurasCompacto = ["1mm", "2mm", "3mm", "4mm", "5mm", "6mm", "8mm", "10mm"];

const breadcrumbSchema = createBreadcrumbSchema([
  { name: "Home", url: "/" },
  { name: "Chapas", url: "/chapas" },
  { name: "Policarbonato" },
]);

const productSchema = createProductSchema({
  name: "Chapa de Policarbonato",
  description:
    "Chapas de policarbonato alveolar e compacto no Rio de Janeiro. Resistência, leveza e proteção UV para coberturas, blindagem e projetos industriais.",
  image: "https://okplast.com.br/og-image.jpg",
  brand: "OK Plast",
});

const policarbonatoSchema = {
  "@context": "https://schema.org",
  "@graph": [breadcrumbSchema, productSchema],
};

export default function Policarbonato() {
  const { openWhatsAppModal } = useWhatsAppModal();

  return (
    <>
      <SEOHead
        title="Chapa de Policarbonato no Rio de Janeiro | OK Plast"
        description="Chapas de policarbonato alveolar e compacto no RJ. Leveza, resistência ao impacto e proteção UV. Corte sob medida. Distribuidora no Rio de Janeiro."
        canonical="/chapas/policarbonato"
        schema={policarbonatoSchema}
      />

      {/* Breadcrumb */}
      <div className="bg-muted/50 py-3">
        <div className="container-custom">
          <nav className="flex items-center gap-2 text-sm text-muted-foreground" aria-label="Breadcrumb">
            <Link to="/" className="hover:text-foreground transition-colors">Home</Link>
            <span>/</span>
            <Link to="/chapas" className="hover:text-foreground transition-colors">Chapas</Link>
            <span>/</span>
            <span className="text-foreground" aria-current="page">Policarbonato</span>
          </nav>
        </div>
      </div>

      {/* Hero */}
      <section className="bg-muted py-16 md:py-20">
        <div className="container-custom">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
            <div>
              <h1 className="font-bold text-3xl md:text-4xl lg:text-5xl text-foreground mb-6">
                CHAPAS DE POLICARBONATO NO RIO DE JANEIRO
              </h1>
              <p className="text-lg text-accent font-medium mb-4">
                Alveolar e compacto — distribuidora no RJ
              </p>
              <p className="text-muted-foreground mb-8">
                A OK Plast distribui chapas de policarbonato alveolar e compacto no Rio de Janeiro.
                Soluções leves e resistentes para coberturas, pergolados, blindagem arquitetônica,
                proteções industriais e comunicação visual, sempre com corte sob medida e entrega rápida.
              </p>
              <div className="flex flex-col items-start gap-3">
                <Button
                  size="lg"
                  className="btn-whatsapp text-lg px-8 py-6"
                  onClick={() => openWhatsAppModal("Chapa de Policarbonato")}
                >
                  <MessageCircle className="h-5 w-5 mr-2" />
                  Orçamento via WhatsApp
                </Button>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="aspect-[4/3] bg-muted rounded-lg overflow-hidden">
                <img
                  src={heroPolicarbonatoAlveolar}
                  alt="Chapa de policarbonato alveolar no RJ - OK Plast"
                  className="w-full h-full object-cover"
                  loading="eager"
                />
              </div>
              <div className="aspect-[4/3] bg-muted rounded-lg overflow-hidden">
                <img
                  src={heroPolicarbonatoCompacto}
                  alt="Chapa de policarbonato compacto no RJ - OK Plast"
                  className="w-full h-full object-cover"
                  loading="eager"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Linhas de Policarbonato */}
      <section className="section-padding">
        <div className="container-custom">
          <DecorativeDivider />

          <div className="text-center mb-12">
            <h2 className="font-bold text-2xl md:text-3xl text-foreground mb-4">
              Escolha o Policarbonato Ideal para seu Projeto
            </h2>
            <p className="text-muted-foreground max-w-3xl mx-auto">
              Trabalhamos com as duas principais linhas de policarbonato para atender desde coberturas
              residenciais até proteções industriais de alto impacto no Rio de Janeiro.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-start">
            {/* Alveolar */}
            <div className="bg-background rounded-xl border border-border overflow-hidden shadow-xs">
              <div className="aspect-video bg-muted overflow-hidden">
                <img
                  src={heroPolicarbonatoAlveolar}
                  alt="Policarbonato alveolar para coberturas e pergolados no RJ"
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
              </div>
              <div className="p-6 md:p-8">
                <h3 className="font-bold text-xl md:text-2xl text-primary mb-3">
                  Policarbonato Alveolar
                </h3>
                <p className="text-muted-foreground mb-4">
                  Estrutura multiparede com câmaras de ar que proporcionam leveza, isolamento térmico
                  e acústico. Com proteção UV integrada, é ideal para coberturas, pergolados e estufas.
                </p>
                <ul className="space-y-2 mb-6">
                  {["Coberturas e pergolados", "Telhados translúcidos", "Estufas agrícolas", "Fechamentos laterais"].map((item, i) => (
                    <li key={i} className="flex items-center gap-2 text-muted-foreground">
                      <div className="w-1.5 h-1.5 rounded-full bg-accent" />
                      {item}
                    </li>
                  ))}
                </ul>
                <Link
                  to="/chapas/policarbonato-alveolar"
                  className="inline-flex items-center gap-2 text-accent hover:text-accent/80 font-medium transition-colors"
                >
                  Ver Policarbonato Alveolar <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </div>

            {/* Compacto */}
            <div className="bg-background rounded-xl border border-border overflow-hidden shadow-xs">
              <div className="aspect-video bg-muted overflow-hidden">
                <img
                  src={heroPolicarbonatoCompacto}
                  alt="Policarbonato compacto para blindagem e proteções no RJ"
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
              </div>
              <div className="p-6 md:p-8">
                <h3 className="font-bold text-xl md:text-2xl text-primary mb-3">
                  Policarbonato Compacto
                </h3>
                <p className="text-muted-foreground mb-4">
                  250 vezes mais resistente que o vidro e metade do peso. Transparência cristalina
                  com extrema resistência ao impacto, ideal para blindagem, vitrines e proteções.
                </p>
                <ul className="space-y-2 mb-6">
                  {["Blindagem arquitetônica", "Escudos de proteção", "Vitrines de segurança", "Proteções industriais"].map((item, i) => (
                    <li key={i} className="flex items-center gap-2 text-muted-foreground">
                      <div className="w-1.5 h-1.5 rounded-full bg-accent" />
                      {item}
                    </li>
                  ))}
                </ul>
                <Link
                  to="/chapas/policarbonato-compacto"
                  className="inline-flex items-center gap-2 text-accent hover:text-accent/80 font-medium transition-colors"
                >
                  Ver Policarbonato Compacto <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Espessuras */}
      <section className="section-padding bg-muted/30">
        <div className="container-custom">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
            <div>
              <h3 className="font-bold text-xl md:text-2xl text-foreground mb-4">
                Espessuras Alveolar
              </h3>
              <p className="text-muted-foreground mb-4">
                Quanto maior a espessura, maior o isolamento térmico e acústico.
              </p>
              <div className="flex flex-wrap gap-3">
                {espessurasAlveolar.map((esp, index) => (
                  <span key={index} className="px-4 py-2 bg-background rounded-full border border-border text-sm font-medium text-foreground">
                    {esp}
                  </span>
                ))}
              </div>
            </div>

            <div>
              <h3 className="font-bold text-xl md:text-2xl text-foreground mb-4">
                Espessuras Compacto
              </h3>
              <p className="text-muted-foreground mb-4">
                Espessuras maiores oferecem maior proteção e resistência estrutural.
              </p>
              <div className="flex flex-wrap gap-3">
                {espessurasCompacto.map((esp, index) => (
                  <span key={index} className="px-4 py-2 bg-background rounded-full border border-border text-sm font-medium text-foreground">
                    {esp}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Final */}
      <section className="section-padding bg-muted">
        <div className="container-custom text-center">
          <h2 className="font-bold text-2xl md:text-3xl text-foreground mb-4">
            Solicite seu Orçamento de Policarbonato no RJ
          </h2>
          <p className="text-muted-foreground mb-8 max-w-xl mx-auto">
            Informe se precisa de policarbonato alveolar ou compacto, a espessura e as dimensões
            para receber um orçamento personalizado.
          </p>
          <div className="flex flex-col items-center gap-4">
            <Button
              size="lg"
              className="btn-whatsapp text-lg px-8 py-6"
              onClick={() => openWhatsAppModal("Chapa de Policarbonato")}
            >
              <MessageCircle className="h-5 w-5 mr-2" />
              Orçamento via WhatsApp
            </Button>
          </div>
        </div>
      </section>
    </>
  );
}
