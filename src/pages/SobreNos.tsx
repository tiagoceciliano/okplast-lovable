import { COMPANY } from "@/lib/constants";
 import { SEOHead } from "@/components/SEOHead";

export default function SobreNos() {
  return (
    <>
       <SEOHead
         title="Sobre Nós - Lab Acrílicos - 30 Anos de Experiência"
         description="Conheça a Lab Acrílicos: mais de 30 anos fabricando produtos em acrílico de alta qualidade no Rio de Janeiro. Tecnologia de ponta e equipe qualificada."
         canonical="/sobre-nos"
       />
 
      {/* Hero */}
      <section className="gradient-primary text-primary-foreground py-16 md:py-24">
        <div className="container-custom">
          <h1 className="font-display text-3xl md:text-4xl font-bold mb-4">
            Sobre Nós
          </h1>
          <p className="text-lg text-primary-foreground/90 max-w-2xl">
            Conheça a história e os valores da {COMPANY.name}
          </p>
        </div>
      </section>

      {/* Conteúdo */}
      <section className="section-padding">
        <div className="container-custom">
          <div className="max-w-3xl mx-auto prose prose-lg">
            <h2 className="font-display text-2xl font-bold text-foreground">Quem Somos</h2>
            
            <p className="text-muted-foreground">
              A <strong className="text-foreground">{COMPANY.name}</strong> é uma empresa especializada na fabricação 
              e comercialização de chapas de acrílico e produtos personalizados. Com mais de <strong className="text-foreground">30 anos 
              de experiência</strong> no mercado, nos consolidamos como referência em qualidade, inovação e 
              atendimento personalizado.
            </p>

            <p className="text-muted-foreground">
              Nossa fábrica está equipada com <strong className="text-foreground">tecnologia de ponta</strong> e contamos 
              com uma equipe altamente qualificada, pronta para transformar suas ideias em realidade. 
              Trabalhamos com os melhores materiais do mercado para garantir produtos de alta 
              durabilidade e acabamento impecável.
            </p>

            <h2 className="font-display text-2xl font-bold text-foreground mt-8">Nossa Missão</h2>
            
            <p className="text-muted-foreground">
              Oferecer soluções em acrílico de alta qualidade, atendendo às necessidades específicas 
              de cada cliente com agilidade, competência e preço justo. Buscamos constantemente a 
              inovação e a excelência em todos os nossos processos.
            </p>

            <h2 className="font-display text-2xl font-bold text-foreground mt-8">Nossos Valores</h2>
            
            <ul className="text-muted-foreground space-y-2">
              <li><strong className="text-foreground">Qualidade:</strong> Compromisso com produtos de excelência</li>
              <li><strong className="text-foreground">Inovação:</strong> Sempre buscando novas soluções e tecnologias</li>
              <li><strong className="text-foreground">Atendimento:</strong> Cliente em primeiro lugar, sempre</li>
              <li><strong className="text-foreground">Ética:</strong> Transparência em todas as relações comerciais</li>
              <li><strong className="text-foreground">Sustentabilidade:</strong> Respeito ao meio ambiente em nossos processos</li>
            </ul>

            <h2 className="font-display text-2xl font-bold text-foreground mt-8">Nossa Estrutura</h2>
            
            <p className="text-muted-foreground">
              Contamos com uma estrutura completa para atender desde pequenos pedidos até grandes 
              projetos corporativos. Nossa fábrica possui maquinário moderno para corte, usinagem, 
              polimento e dobra de acrílico, permitindo a fabricação de peças com alta precisão 
              dimensional e acabamento superior.
            </p>

            <p className="text-muted-foreground">
              Atendemos em todo o território nacional, com logística eficiente e embalagem segura 
              para garantir que seu produto chegue em perfeitas condições.
            </p>

            <div className="mt-8 p-6 bg-secondary rounded-lg">
              <h3 className="font-display text-xl font-bold text-foreground mb-4">Entre em Contato</h3>
              <p className="text-muted-foreground mb-2">
                <strong className="text-foreground">Endereço:</strong> {COMPANY.address}
              </p>
              <p className="text-muted-foreground mb-2">
                <strong className="text-foreground">Telefone:</strong> {COMPANY.phone}
              </p>
              <p className="text-muted-foreground mb-2">
                <strong className="text-foreground">WhatsApp:</strong> {COMPANY.whatsappFormatted}
              </p>
              <p className="text-muted-foreground">
                <strong className="text-foreground">E-mail:</strong> {COMPANY.email}
              </p>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
