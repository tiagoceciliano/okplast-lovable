import { ProductPage } from "@/components/products/ProductPage";

export default function PotesDoces() {
  return (
    <ProductPage
      title="Potes para Doces e Guloseimas"
      description="Potes de acrílico especialmente desenvolvidos para confeitarias, buffets, festas e estabelecimentos comerciais. Nossos potes valorizam a apresentação dos doces, mantendo-os frescos e protegidos. Disponíveis em diversos tamanhos e formatos para atender diferentes tipos de produtos."
      benefits={[
        "Acrílico atóxico e seguro para alimentos",
        "Tampa hermética para manter a frescura",
        "Alta transparência para visualização do produto",
        "Fácil limpeza e higienização",
        "Resistente a quedas",
        "Empilháveis para otimizar espaço",
      ]}
      variations={[
        "Pote redondo pequeno (até 500ml)",
        "Pote redondo médio (500ml a 1L)",
        "Pote redondo grande (acima de 1L)",
        "Pote quadrado",
        "Pote com colher dosadora",
        "Bomboniere de acrílico",
        "Pote para confeitaria com tampa",
      ]}
    />
  );
}
