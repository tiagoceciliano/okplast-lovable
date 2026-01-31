import { Link } from "react-router-dom";
import { ReactNode } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { CheckCircle, MessageCircle } from "lucide-react";
import { useWhatsAppModal } from "@/contexts/WhatsAppModalContext";

interface ProductPageProps {
  title: string;
  description: string;
  benefits: string[];
  variations?: string[];
  imageUrl?: string;
  children?: ReactNode;
}

export function ProductPage({ title, description, benefits, variations, imageUrl, children }: ProductPageProps) {
  const { openWhatsAppModal } = useWhatsAppModal();

  return (
    <>
      {/* Hero */}
      <section className="gradient-primary text-primary-foreground py-16 md:py-24">
        <div className="container-custom">
          <nav className="text-sm text-primary-foreground/70 mb-4">
            <Link to="/" className="hover:text-primary-foreground">Home</Link>
            {" / "}
            <Link to="/acrilico-sob-medida" className="hover:text-primary-foreground">Acrílico Sob Medida</Link>
            {" / "}
            <span className="text-primary-foreground">{title}</span>
          </nav>
          <h1 className="font-display text-3xl md:text-4xl font-bold mb-4">
            {title}
          </h1>
        </div>
      </section>

      {/* Conteúdo */}
      <section className="section-padding">
        <div className="container-custom">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Descrição */}
            <div className="lg:col-span-2 space-y-8">
              {/* Imagem do Produto */}
              {imageUrl && (
                <div className="aspect-video rounded-lg overflow-hidden bg-muted">
                  <img 
                    src={imageUrl} 
                    alt={title} 
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />
                </div>
              )}

              <div className="prose prose-lg max-w-none">
                <p className="text-lg text-muted-foreground">{description}</p>
              </div>

              {/* Benefícios */}
              <Card>
                <CardContent className="pt-6">
                  <h2 className="font-display text-xl font-bold mb-4">Benefícios e Diferenciais</h2>
                  <ul className="space-y-3">
                    {benefits.map((benefit, index) => (
                      <li key={index} className="flex items-start gap-3">
                        <CheckCircle className="h-5 w-5 text-accent shrink-0 mt-0.5" />
                        <span>{benefit}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>

              {/* Variações */}
              {variations && variations.length > 0 && (
                <Card>
                  <CardContent className="pt-6">
                    <h2 className="font-display text-xl font-bold mb-4">Variações Disponíveis</h2>
                    <ul className="grid grid-cols-1 md:grid-cols-2 gap-2">
                      {variations.map((variation, index) => (
                        <li key={index} className="flex items-center gap-2 text-muted-foreground">
                          <span className="w-2 h-2 rounded-full bg-accent" />
                          {variation}
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              )}

              {children}
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              <Card className="sticky top-24">
                <CardContent className="pt-6 space-y-4">
                  <h3 className="font-display text-lg font-bold">Solicitar Orçamento</h3>
                  <p className="text-sm text-muted-foreground">
                    Fabricamos sob medida conforme suas especificações. Solicite um orçamento sem compromisso.
                  </p>
                  <Button className="w-full" size="lg" asChild>
                    <Link to="/home/orcamento">Solicitar Orçamento</Link>
                  </Button>
                  <Button 
                    variant="outline" 
                    className="w-full btn-whatsapp border-0" 
                    onClick={() => openWhatsAppModal(title)}
                  >
                    <MessageCircle className="h-4 w-4 mr-2" />
                    Falar pelo WhatsApp
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
