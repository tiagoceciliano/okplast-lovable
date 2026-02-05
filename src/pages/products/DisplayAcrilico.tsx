import { ProductPage } from "@/components/products/ProductPage";
import { SOBMEDIDA_IMAGES } from "@/lib/images";

export default function DisplayAcrilico() {
  return (
    <ProductPage
      title="Display de Acrílico"
      description="Displays de acrílico para comunicação visual, exposição de produtos e informações. Nossos displays são fabricados com precisão para atender diversos formatos de mídia, desde pequenos porta-preços até grandes displays de chão. Ideais para pontos de venda, recepções, eventos e feiras."
      imageUrl={SOBMEDIDA_IMAGES.display}
       seoTitle="Display de Acrílico - Mesa e Parede"
       seoDescription="Displays de acrílico para comunicação visual e exposição de produtos. Diversos tamanhos. Fabricação sob medida no RJ."
      benefits={[
        "Comunicação visual de alta qualidade",
        "Múltiplos formatos disponíveis",
        "Fácil troca de material impresso",
        "Resistente e durável",
        "Opções de mesa, balcão e chão",
        "Acabamento profissional",
      ]}
      variations={[
        "Display de mesa A4",
        "Display de mesa A5",
        "Display de mesa A6",
        "Display em L",
        "Display em T",
        "Display de chão",
        "Porta-cardápio",
        "Porta-preço",
      ]}
    />
  );
}
