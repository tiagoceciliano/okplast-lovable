import { ProductPage } from "@/components/products/ProductPage";
import { SOBMEDIDA_IMAGES } from "@/lib/images";

export default function CaixasSobMedida() {
  return (
    <ProductPage
      title="Caixas Sob Medida"
      description="Fabricamos caixas de acrílico em qualquer tamanho e formato para atender às suas necessidades específicas. Nossas caixas são produzidas com acrílico de alta qualidade, garantindo transparência, resistência e acabamento impecável. Ideais para exposição de produtos, organização, proteção de itens delicados e muito mais."
      imageUrl={SOBMEDIDA_IMAGES.caixas}
       seoTitle="Caixas de Acrílico Sob Medida - Todos os Tamanhos"
       seoDescription="Fabricamos caixas de acrílico em qualquer tamanho. Cristal, colorido ou fumê. Acabamento impecável. Orçamento grátis no RJ."
      benefits={[
        "Fabricação personalizada nas medidas exatas do seu projeto",
        "Acrílico de alta transparência e resistência",
        "Acabamento polido e bordas lisas",
        "Opções com ou sem tampa",
        "Disponível em acrílico cristal, colorido ou fumê",
        "Ideal para vitrines, organização e exposição",
      ]}
      variations={[
        "Caixa com tampa removível",
        "Caixa com tampa articulada",
        "Caixa sem tampa",
        "Caixa com divisórias internas",
      ]}
    />
  );
}
