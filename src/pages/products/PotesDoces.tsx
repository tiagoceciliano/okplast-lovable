import { ProductPage } from "@/components/products/ProductPage";
import { SOBMEDIDA_IMAGES } from "@/lib/images";

export default function PotesDoces() {
  return (
    <ProductPage
      title="Potes para Doces e Guloseimas"
      description="Potes de acrílico especialmente desenvolvidos para confeitarias, buffets, festas e estabelecimentos comerciais. Nossos potes valorizam a apresentação dos doces, mantendo-os frescos e protegidos. Disponíveis em diversos tamanhos e formatos para atender diferentes tipos de produtos."
      imageUrl={SOBMEDIDA_IMAGES.potesDoces}
       seoTitle="Potes de Acrílico para Doces e Confeitaria"
       seoDescription="Potes de acrílico para confeitarias e buffets. Atóxico e seguro para alimentos. Tampa hermética. Fabricação no RJ."
      benefits={[
        "Acrílico atóxico e seguro para alimentos",
        "Tampa hermética para manter a frescura",
        "Alta transparência para visualização do produto",
        "Fácil limpeza e higienização",
        "Resistente a quedas",
        "Empilháveis para otimizar espaço",
      ]}
      variations={[
        "Pote com colher dosadora",
        "Bomboniere de acrílico",
        "Pote para confeitaria com tampa",
      ]}
    />
  );
}
