import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowRight } from "lucide-react";

const produtos = [
  { nome: "Caixas Sob Medida", href: "/acrilico-sob-medida/caixas-sob-medida", desc: "Caixas em acrílico de todos os tamanhos e formatos" },
  { nome: "Cúpulas e Redomas", href: "/acrilico-sob-medida/cupulas-e-redomas", desc: "Proteção e exposição elegante para seus produtos" },
  { nome: "Potes para Doces e Guloseimas", href: "/acrilico-sob-medida/potes-para-doces-e-guloseimas", desc: "Ideal para confeitarias e buffets" },
  { nome: "Potes para Grãos e Cereais", href: "/acrilico-sob-medida/potes-para-graos-e-cereais-a-granel", desc: "Para lojas de produtos naturais" },
  { nome: "Urna de Acrílico", href: "/acrilico-sob-medida/urna-de-acrilico", desc: "Para sorteios, votações e promoções" },
  { nome: "Caixa de Sugestão", href: "/acrilico-sob-medida/caixa-de-sugestao", desc: "Colete feedback de forma organizada" },
  { nome: "Medalhas Personalizadas", href: "/acrilico-sob-medida/medalhas-personalizadas", desc: "Premiações com personalização exclusiva" },
  { nome: "Troféus Personalizados", href: "/acrilico-sob-medida/trofeus-personalizados", desc: "Reconhecimento com design único" },
  { nome: "Placa de Acrílico Customizada", href: "/acrilico-sob-medida/placa-de-acrilico-customizada", desc: "Placas personalizadas para diversos fins" },
  { nome: "Placa de Acrílico Sinalização", href: "/acrilico-sob-medida/placa-de-acrilico-sinalizacao", desc: "Sinalização profissional e durável" },
  { nome: "Expositores para Bijuterias", href: "/acrilico-sob-medida/expositores-para-bijuterias", desc: "Destaque suas peças com elegância" },
  { nome: "Expositores para Calçados", href: "/acrilico-sob-medida/expositores-para-calcados", desc: "Apresente calçados de forma atrativa" },
  { nome: "Expositores para Óculos", href: "/acrilico-sob-medida/expositores-para-oculos", desc: "Organização e visibilidade para óticas" },
  { nome: "Display de Acrílico", href: "/acrilico-sob-medida/display-de-acrilico", desc: "Comunicação visual de qualidade" },
  { nome: "Porta Folder", href: "/acrilico-sob-medida/porta-folder", desc: "De mesa ou parede, organize seus materiais" },
];

export default function AcrilicoSobMedida() {
  return (
    <>
      {/* Hero */}
      <section className="gradient-primary text-primary-foreground py-16 md:py-24">
        <div className="container-custom">
          <h1 className="font-display text-3xl md:text-4xl font-bold mb-4">
            Acrílico Sob Medida
          </h1>
          <p className="text-lg text-primary-foreground/90 max-w-2xl">
            Fabricamos produtos personalizados em acrílico de alta qualidade para atender suas necessidades específicas
          </p>
        </div>
      </section>

      {/* Grid de Produtos */}
      <section className="section-padding">
        <div className="container-custom">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {produtos.map((produto, index) => (
              <Card key={index} className="group hover:shadow-lg transition-all hover:-translate-y-1">
                <CardHeader>
                  <CardTitle className="text-lg group-hover:text-accent transition-colors">
                    {produto.nome}
                  </CardTitle>
                  <CardDescription>{produto.desc}</CardDescription>
                </CardHeader>
                <CardContent>
                  <Button variant="outline" size="sm" asChild>
                    <Link to={produto.href}>
                      Saiba mais
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="section-padding bg-secondary">
        <div className="container-custom text-center">
          <h2 className="font-display text-2xl font-bold mb-4">
            Não encontrou o que procura?
          </h2>
          <p className="text-muted-foreground mb-6 max-w-xl mx-auto">
            Fabricamos qualquer produto em acrílico sob medida. Entre em contato e descreva seu projeto.
          </p>
          <Button size="lg" asChild>
            <Link to="/home/orcamento">Solicitar Orçamento Personalizado</Link>
          </Button>
        </div>
      </section>
    </>
  );
}
