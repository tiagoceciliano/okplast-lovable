import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowRight, CheckCircle, Star, Users, Award, Truck, Shield, Wrench } from "lucide-react";
import { COMPANY } from "@/lib/constants";

// Produtos Sob Medida - cards
const produtosSobMedida = [
  { nome: "Caixas Sob Medida", href: "/acrilico-sob-medida/caixas-sob-medida", desc: "Caixas em acrílico de todos os tamanhos" },
  { nome: "Cúpulas e Redomas", href: "/acrilico-sob-medida/cupulas-e-redomas", desc: "Proteção e exposição elegante" },
  { nome: "Potes para Doces", href: "/acrilico-sob-medida/potes-para-doces-e-guloseimas", desc: "Ideal para confeitarias" },
  { nome: "Urna de Acrílico", href: "/acrilico-sob-medida/urna-de-acrilico", desc: "Para sorteios e promoções" },
  { nome: "Expositores", href: "/acrilico-sob-medida/expositores-para-bijuterias", desc: "Para bijuterias, calçados e óculos" },
  { nome: "Display de Acrílico", href: "/acrilico-sob-medida/display-de-acrilico", desc: "Comunicação visual de qualidade" },
];

// Tipos de Chapas
const tiposChapas = [
  { nome: "Chapa de Acrílico Cristal", desc: "Transparência total, ideal para vitrines" },
  { nome: "Chapa de Acrílico Colorido", desc: "Diversas cores para projetos personalizados" },
  { nome: "Chapa de Acrílico Leitoso", desc: "Efeito difuso para iluminação" },
  { nome: "Chapa de Acrílico Espelhado", desc: "Acabamento espelhado de alta qualidade" },
  { nome: "Chapa de Acrílico Fumê", desc: "Tons escuros para visual moderno" },
  { nome: "Chapa de Acrílico Texturizado", desc: "Padrões exclusivos para design" },
];

// 6 Motivos
const motivos = [
  { icon: Award, titulo: "30 Anos de Experiência", desc: "Tradição e conhecimento no mercado de acrílico" },
  { icon: Wrench, titulo: "Fabricação Própria", desc: "Controle total de qualidade do início ao fim" },
  { icon: Truck, titulo: "Entrega para Todo Brasil", desc: "Logística eficiente e segura" },
  { icon: Shield, titulo: "Garantia de Qualidade", desc: "Produtos com garantia e suporte técnico" },
  { icon: Users, titulo: "Atendimento Personalizado", desc: "Equipe especializada para seu projeto" },
  { icon: Star, titulo: "Preço Justo", desc: "Melhor custo-benefício do mercado" },
];

// Depoimentos
const depoimentos = [
  { nome: "Carlos Silva", empresa: "Loja de Bijuterias", texto: "Excelente qualidade nos expositores. Minha loja ficou muito mais organizada e bonita!" },
  { nome: "Ana Paula", empresa: "Confeitaria Doce Sabor", texto: "Os potes de acrílico são perfeitos para expor os doces. Clientes elogiam muito!" },
  { nome: "Roberto Santos", empresa: "Arquiteto", texto: "Trabalho com a Lab Acrílicos há anos. Sempre entregam no prazo e com qualidade impecável." },
];

export default function Index() {
  return (
    <>
      {/* Hero Section */}
      <section className="relative gradient-primary text-primary-foreground overflow-hidden">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg%20width%3D%2260%22%20height%3D%2260%22%20viewBox%3D%220%200%2060%2060%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%3E%3Cg%20fill%3D%22none%22%20fill-rule%3D%22evenodd%22%3E%3Cg%20fill%3D%22%23ffffff%22%20fill-opacity%3D%220.05%22%3E%3Cpath%20d%3D%22M36%2034v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6%2034v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6%204V0H4v4H0v2h4v4h2V6h4V4H6z%22%2F%3E%3C%2Fg%3E%3C%2Fg%3E%3C%2Fsvg%3E')] opacity-50" />
        <div className="container-custom relative py-16 md:py-24 lg:py-32">
          <div className="max-w-3xl">
            <h1 className="font-display text-3xl md:text-4xl lg:text-5xl font-bold mb-6">
              {COMPANY.slogan}
            </h1>
            <p className="text-lg md:text-xl text-primary-foreground/90 mb-8 max-w-2xl">
              A <strong>{COMPANY.name}</strong> é especializada na fabricação e venda de chapas de acrílico e produtos 
              personalizados. Há mais de 30 anos oferecendo qualidade, inovação e as melhores soluções 
              em acrílico para empresas e consumidores de todo o Brasil.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Button size="lg" variant="secondary" asChild>
                <Link to="/home/orcamento">
                  Solicitar Orçamento
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" className="bg-transparent border-primary-foreground/50 hover:bg-primary-foreground/10" asChild>
                <Link to="/acrilico-sob-medida">Ver Produtos</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* 6 Motivos */}
      <section className="section-padding bg-secondary">
        <div className="container-custom">
          <div className="text-center mb-12">
            <h2 className="font-display text-2xl md:text-3xl font-bold mb-4">
              6 Motivos para Escolher a {COMPANY.name}
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Descubra por que somos a escolha certa para seu projeto em acrílico
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {motivos.map((motivo, index) => (
              <Card key={index} className="border-0 shadow-sm hover:shadow-md transition-shadow">
                <CardHeader>
                  <div className="w-12 h-12 rounded-lg bg-accent/10 flex items-center justify-center mb-4">
                    <motivo.icon className="h-6 w-6 text-accent" />
                  </div>
                  <CardTitle className="text-lg">{motivo.titulo}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-base">{motivo.desc}</CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Produtos Sob Medida */}
      <section className="section-padding">
        <div className="container-custom">
          <div className="text-center mb-12">
            <h2 className="font-display text-2xl md:text-3xl font-bold mb-4">
              Produtos Sob Medida
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Fabricamos produtos personalizados em acrílico de alta qualidade para atender suas necessidades específicas
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {produtosSobMedida.map((produto, index) => (
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
          <div className="text-center mt-8">
            <Button size="lg" asChild>
              <Link to="/acrilico-sob-medida">
                Ver Todos os Produtos
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
            <h2 className="font-display text-2xl md:text-3xl font-bold mb-4">
              Chapas e Pedaços de Placas de Acrílico
            </h2>
            <p className="text-primary-foreground/80 max-w-2xl mx-auto">
              Trabalhamos com diversos tipos de chapas de acrílico para atender projetos de todos os portes
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {tiposChapas.map((chapa, index) => (
              <div 
                key={index} 
                className="p-6 rounded-lg bg-primary-foreground/10 hover:bg-primary-foreground/15 transition-colors"
              >
                <h3 className="font-semibold text-lg mb-2">{chapa.nome}</h3>
                <p className="text-primary-foreground/70 text-sm">{chapa.desc}</p>
              </div>
            ))}
          </div>
          <div className="text-center mt-8">
            <Button size="lg" variant="secondary" asChild>
              <Link to="/chapas-de-acrilico">
                Ver Todas as Chapas
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Satisfação Garantida - Depoimentos */}
      <section className="section-padding bg-secondary">
        <div className="container-custom">
          <div className="text-center mb-12">
            <h2 className="font-display text-2xl md:text-3xl font-bold mb-4">
              Satisfação Garantida
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Veja o que nossos clientes dizem sobre a {COMPANY.name}
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {depoimentos.map((dep, index) => (
              <Card key={index} className="border-0">
                <CardContent className="pt-6">
                  <div className="flex gap-1 mb-4">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star key={star} className="h-5 w-5 fill-accent text-accent" />
                    ))}
                  </div>
                  <p className="text-muted-foreground mb-4 italic">"{dep.texto}"</p>
                  <div>
                    <p className="font-semibold">{dep.nome}</p>
                    <p className="text-sm text-muted-foreground">{dep.empresa}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Grande Empresa, Grandes Clientes */}
      <section className="section-padding">
        <div className="container-custom">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="font-display text-2xl md:text-3xl font-bold mb-4">
              Grande Empresa, Grandes Clientes
            </h2>
            <p className="text-muted-foreground mb-8">
              A {COMPANY.name} atende desde pequenos empreendedores até grandes corporações. 
              Nossa estrutura permite entregar projetos de qualquer escala com a mesma 
              dedicação e qualidade que nos tornaram referência no mercado.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <div className="flex items-center gap-2 text-left">
                <CheckCircle className="h-5 w-5 text-accent shrink-0" />
                <span>Atendimento B2B e B2C</span>
              </div>
              <div className="flex items-center gap-2 text-left">
                <CheckCircle className="h-5 w-5 text-accent shrink-0" />
                <span>Projetos sob encomenda</span>
              </div>
              <div className="flex items-center gap-2 text-left">
                <CheckCircle className="h-5 w-5 text-accent shrink-0" />
                <span>Entrega nacional</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Final */}
      <section className="section-padding gradient-primary text-primary-foreground">
        <div className="container-custom text-center">
          <h2 className="font-display text-2xl md:text-3xl font-bold mb-4">
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
              variant="outline" 
              className="bg-transparent border-primary-foreground/50 hover:bg-primary-foreground/10 btn-whatsapp border-0"
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
