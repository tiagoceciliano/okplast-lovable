import { CheckCircle, Phone, Award, DollarSign, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { COMPANY } from "@/lib/constants";

const beneficios = [
  { icon: Phone, titulo: "Contato Rápido", desc: "Resposta em até 24 horas" },
  { icon: Award, titulo: "Chapas de Alta Qualidade", desc: "Materiais de primeira linha" },
  { icon: DollarSign, titulo: "Melhor Preço do RJ", desc: "Direto da distribuidora" },
];

interface Props {
  onWhatsAppClick: () => void;
}

export function HomeBelowFold({ onWhatsAppClick }: Props) {
  return (
    <>
      {/* CTA Final */}
      <section className="section-padding bg-primary text-primary-foreground">
        <div className="container-custom text-center">
          <h2 className="font-bold text-2xl md:text-3xl mb-4">Pronto para seu Orçamento?</h2>
          <p className="text-primary-foreground/90 mb-8 max-w-2xl mx-auto">
            Entre em contato conosco e solicite um orçamento personalizado. Distribuidora de chapas plásticas no Rio de
            Janeiro com entrega rápida e melhor preço do RJ.
          </p>
          <div className="flex flex-col items-center gap-4">
            <Button size="lg" className="btn-whatsapp text-lg px-8 py-6" onClick={onWhatsAppClick}>
              <MessageCircle className="h-5 w-5 mr-2" />
              Orçamento via WhatsApp
            </Button>
          </div>
        </div>
      </section>

      {/* Por que escolher */}
      <section className="section-padding bg-secondary">
        <div className="container-custom">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
            <div>
              <h2 className="font-bold text-2xl md:text-3xl text-foreground mb-8">
                Por que escolher a {COMPANY.name} no Rio de Janeiro?
              </h2>
              <p className="text-muted-foreground mb-6">
                Somos uma distribuidora de chapas plásticas localizada em Penha Circular, Rio de Janeiro. Com anos de
                experiência no mercado carioca, oferecemos os melhores preços em acrílico, policarbonato, PETG,
                poliestireno, PVC expandido e ACM para todo o RJ e região metropolitana.
              </p>
              <div className="space-y-6 mb-8">
                {beneficios.map((beneficio, index) => (
                  <div key={index} className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-lg bg-accent/10 flex items-center justify-center shrink-0">
                      <beneficio.icon className="h-6 w-6 text-accent" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-foreground mb-1">{beneficio.titulo}</h3>
                      <p className="text-muted-foreground text-sm">{beneficio.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-accent shrink-0" />
                  <span className="text-sm">Atendimento Prioritário B2B</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-accent shrink-0" />
                  <span className="text-sm">Corte sua chapa inteira</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-accent shrink-0" />
                  <span className="text-sm">Entrega no RJ</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}