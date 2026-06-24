import { COMPANY } from "@/lib/constants";
import { SEOHead } from "@/components/SEOHead";

export default function SobreNos() {
  return (
    <>
      <SEOHead
        title="Sobre Nós - OK Plast"
        description="Conheça a OK Plast: distribuidora de chapas plásticas no Rio de Janeiro. Acrílico, Policarbonato, PETG, PS, PVC e ACM."
        canonical="/sobre-nos"
      />

      <section className="gradient-primary text-primary-foreground py-16 md:py-24">
        <div className="container-custom">
          <h1 className="font-display text-3xl md:text-4xl font-bold mb-4">Sobre Nós</h1>
          <p className="text-lg text-primary-foreground/90 max-w-2xl">
            Conheça a história e os valores da {COMPANY.name}
          </p>
        </div>
      </section>

      <section className="section-padding">
        <div className="container-custom">
          <div className="max-w-3xl mx-auto prose prose-lg">
            <h2 className="font-display text-2xl font-bold text-foreground">Quem Somos</h2>
            
            <p className="text-muted-foreground">
              A <strong className="text-foreground">{COMPANY.legalName}</strong> é uma distribuidora 
              especializada na comercialização de chapas plásticas. Oferecemos uma ampla variedade de 
              materiais como Acrílico, Policarbonato, PETG, Poliestireno, PVC Expandido e ACM, 
              atendendo às mais diversas necessidades do mercado.
            </p>

            <p className="text-muted-foreground">
              Contamos com corte sob medida, atendimento ágil e entrega rápida. 
              Nosso compromisso é fornecer materiais de alta qualidade com o melhor preço da região.
            </p>

            <h2 className="font-display text-2xl font-bold text-foreground mt-8">Nossa Missão</h2>
            
            <p className="text-muted-foreground">
              Oferecer chapas plásticas de alta qualidade, atendendo às necessidades específicas 
              de cada cliente com agilidade, competência e preço justo.
            </p>

            <h2 className="font-display text-2xl font-bold text-foreground mt-8">Nossos Valores</h2>
            
            <ul className="text-muted-foreground space-y-2">
              <li><strong className="text-foreground">Qualidade:</strong> Materiais de primeira linha</li>
              <li><strong className="text-foreground">Agilidade:</strong> Resposta rápida e entregas no prazo</li>
              <li><strong className="text-foreground">Atendimento:</strong> Cliente em primeiro lugar</li>
              <li><strong className="text-foreground">Ética:</strong> Transparência em todas as relações</li>
            </ul>

            <div className="mt-8 p-6 bg-secondary rounded-lg">
              <h3 className="font-display text-xl font-bold text-foreground mb-4">Entre em Contato</h3>
              <p className="text-muted-foreground mb-2">
                <strong className="text-foreground">Endereço:</strong> {COMPANY.address}
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
