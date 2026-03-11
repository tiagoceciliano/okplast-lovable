import { Headphones, Truck, ClipboardEdit, Receipt, BadgeDollarSign, Building2 } from "lucide-react";
import { cn } from "@/lib/utils";

const motivos = [
  { 
    icon: Headphones, 
    titulo: "1º Atendimento Ágil e Eficaz", 
    desc: "Orçamentos e cotações respondidos em até 24 horas úteis. Atendimento personalizado via WhatsApp, e-mail ou telefone."
  },
  { 
    icon: Truck, 
    titulo: "2º Frete Seguro", 
    desc: "Embalagem reforçada e envio seguro para todo o Brasil. Trabalhamos com transportadoras confiáveis para garantir que sua chapa chegue intacta."
  },
  { 
    icon: ClipboardEdit, 
    titulo: "3º Corte Sob Medida", 
    desc: "Cortamos suas chapas nas dimensões exatas que você precisa. Precisão no corte para otimizar seu material e reduzir desperdício."
  },
  { 
    icon: Receipt, 
    titulo: "4º Emissão de NF-e", 
    desc: "Todas as vendas acompanham Nota Fiscal Eletrônica. Transparência e segurança para sua empresa em todas as transações."
  },
  { 
    icon: BadgeDollarSign, 
    titulo: "5º Faturamento e Linha de Crédito", 
    desc: "Condições especiais para empresas com cadastro aprovado. Faturamento com prazo e linha de crédito para clientes recorrentes."
  },
  { 
    icon: Building2, 
    titulo: "6º Empresa Sólida e Confiável", 
    desc: "Anos de experiência no mercado de chapas plásticas. Estoque próprio, preço competitivo e compromisso com a qualidade."
  },
];

interface MotivosCarouselProps {
  className?: string;
}

export function MotivosCarousel({ className }: MotivosCarouselProps) {
  return (
    <div className={cn("grid grid-cols-1 md:grid-cols-3 gap-6", className)}>
      {motivos.map((motivo, index) => (
        <div 
          key={index} 
          className="bg-card border-2 border-primary rounded-xl p-6 text-center shadow-sm hover:shadow-md transition-shadow"
        >
          <div className="flex justify-center mb-4">
            <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
              <motivo.icon className="h-8 w-8 text-primary" />
            </div>
          </div>
          <h3 className="font-bold text-primary text-lg mb-3">
            {motivo.titulo}
          </h3>
          <p className="text-muted-foreground text-sm leading-relaxed">
            {motivo.desc}
          </p>
        </div>
      ))}
    </div>
  );
}
