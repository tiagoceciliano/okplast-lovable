import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const tiposChapas = [
  { nome: "Chapa de Acrílico Cristal", desc: "Transparência total com alta transmissão de luz. Ideal para vitrines, displays e projetos que exigem visibilidade perfeita." },
  { nome: "Chapa de Acrílico Colorido", desc: "Disponível em diversas cores para projetos personalizados. Cores sólidas e translúcidas para diferentes aplicações." },
  { nome: "Chapa de Acrílico Leitoso", desc: "Efeito difuso que distribui a luz uniformemente. Perfeito para painéis de iluminação e projetos de design." },
  { nome: "Chapa de Acrílico Espelhado", desc: "Acabamento espelhado de alta qualidade em diversas cores. Ideal para decoração e projetos arquitetônicos." },
  { nome: "Chapa de Acrílico Fumê", desc: "Tons escuros para um visual moderno e sofisticado. Disponível em diferentes intensidades." },
  { nome: "Chapa de Acrílico Texturizado", desc: "Padrões exclusivos para projetos diferenciados. Ideal para divisórias e aplicações decorativas." },
  { nome: "Chapa de Acrílico Fluorescente", desc: "Cores vibrantes que brilham sob luz UV. Perfeito para comunicação visual de impacto." },
  { nome: "Pedaços e Retalhos", desc: "Sobras e cortes de chapas com preços especiais. Ideal para pequenos projetos e protótipos." },
];

export default function ChapasDeAcrilico() {
  return (
    <>
      {/* Hero */}
      <section className="gradient-primary text-primary-foreground py-16 md:py-24">
        <div className="container-custom">
          <h1 className="font-display text-3xl md:text-4xl font-bold mb-4">
            Chapas de Acrílico
          </h1>
          <p className="text-lg text-primary-foreground/90 max-w-2xl">
            Trabalhamos com diversos tipos de chapas de acrílico para atender projetos de todos os portes
          </p>
        </div>
      </section>

      {/* Tipos de Chapas */}
      <section className="section-padding">
        <div className="container-custom">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {tiposChapas.map((chapa, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <CardTitle className="text-lg">{chapa.nome}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-base">{chapa.desc}</CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Informações sobre espessuras */}
      <section className="section-padding bg-secondary">
        <div className="container-custom">
          <div className="max-w-3xl mx-auto">
            <h2 className="font-display text-2xl font-bold mb-6 text-center">
              Espessuras Disponíveis
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
              {["2mm", "3mm", "4mm", "5mm", "6mm", "8mm", "10mm", "15mm", "20mm", "25mm", "30mm", "Sob consulta"].map((esp) => (
                <div key={esp} className="bg-card p-3 rounded-lg text-center font-medium">
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

      {/* CTA */}
      <section className="section-padding">
        <div className="container-custom text-center">
          <h2 className="font-display text-2xl font-bold mb-4">
            Solicite seu Orçamento
          </h2>
          <p className="text-muted-foreground mb-6 max-w-xl mx-auto">
            Informe o tipo de chapa, espessura e dimensões desejadas para receber um orçamento personalizado.
          </p>
          <Button size="lg" asChild>
            <Link to="/home/orcamento">Solicitar Orçamento</Link>
          </Button>
        </div>
      </section>
    </>
  );
}
